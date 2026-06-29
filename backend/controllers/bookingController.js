const db = require('../db/connection');
const PDFDocument = require('pdfkit');

const formatDate = (val) => {
  if (!val) return null;
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const dt = new Date(val);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toISOString().split('T')[0];
};

const normalizeTourType = (value) => String(value || 'P2P').toUpperCase();

const COMPANY_NAME = 'TechNova Tours';

const getBookingReference = (tourType, bookingId) => {
  const type = normalizeTourType(tourType);
  const typeCode = type === 'PACKAGE' ? 'PKG' : type === 'CUSTOM' ? 'CUS' : 'P2P';
  return `CBT-${typeCode}-${bookingId}`;
};

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'N/A';
  const n = Number(value);
  if (Number.isNaN(n)) return 'N/A';
  return `LKR ${n.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getPaymentScheduleLines = (tourType, quotedPrice) => {
  const amount = Number(quotedPrice || 0);
  const isP2P = normalizeTourType(tourType) === 'P2P';

  if (isP2P) {
    return [
      `FULL: ${formatMoney(amount)} payable before trip start.`,
    ];
  }

  const deposit = amount * 0.3;
  const final = amount - deposit;

  return [
    `DEPOSIT (30%): ${formatMoney(deposit)} payable at confirmation.`,
    `FINAL (70%): ${formatMoney(final)} payable before trip start.`,
  ];
};

const PDF_ALLOWED_STATUSES = ['ACCEPTED', 'CONFIRMED', 'TOUR_STARTED', 'COMPLETED', 'CLOSED'];

// ── mapBooking ────────────────────────────────────────────────────────────────
// Maps a raw DB row to the shape expected by the frontend.
// Matches the actual schema: new luggage columns, pickup_time column,
// tour_thoughts column, no emergency_* on booking (those are on user).
const mapBooking = (row) => ({
  id:             row.booking_id,
  userId:         row.user_id,
  customerName:   row.customer_name,
  customerPhone:  row.customer_phone,
  customerEmail:  row.email || null,
  tourType:       row.tour_type,
  categoryId:     row.category_id,
  categoryName:   row.category_name || null,
  packageId:      row.package_id    || null,
  packageName:    row.package_name  || null,
  vehicleId:      row.vehicle_id    || null,
  assignedVehicle: row.vehicle_name ? {
    name:        row.vehicle_name,
    plateNumber: row.vehicle_number || '—',
    type:        row.category_name  || '',
  } : null,
  startDate:      formatDate(row.start_date),
  endDate:        formatDate(row.end_date),
  pickupTime:     row.pickup_time   || null,
  bookingDate:    formatDate(row.booking_date),
  startLocation:  row.start_location || null,
  endLocation:    row.end_location   || null,
  totalDays:      row.total_days,
  daysRequired:   row.days_required,
  // Structured luggage fields
  luggage10kg:        row.luggage_10kg        || 0,
  luggage25kg:        row.luggage_25kg        || 0,
  luggage35kg:        row.luggage_35kg        || 0,
  luggageCustomCount: row.luggage_custom_count || 0,
  luggageCustomDesc:  row.luggage_custom_desc  || null,
  noOfAdults:         row.no_of_adults,
  noOfChildren:       row.no_of_children,
  agesOfChildren:     row.ages_of_children || null,
  quotedPrice:        row.quoted_price ? parseFloat(row.quoted_price) : null,
  notes:              row.notes        || null,
  tourThoughts:       row.tour_thoughts || null,
  status:             row.booking_status,
  quotedAt:           row.quoted_at,
  confirmedAt:        row.confirmed_at,
  tourStartedAt:      row.tour_started_at,
  completedAt:        row.completed_at,
  closedAt:           row.closed_at,
});

// ── Shared: resolve categoryId string → integer FK ────────────────────────────
// Accepts either a numeric ID or a display name like "Mini Car".
// If the name doesn't exist yet it is inserted (preserving old behaviour).
const resolveCategoryId = async (categoryId) => {
  if (!isNaN(categoryId) && categoryId !== '') {
    return parseInt(categoryId);
  }
  const [catRows] = await db.execute(
    'SELECT category_id FROM vehicle_category WHERE category_name = ? LIMIT 1',
    [categoryId]
  );
  if (catRows.length > 0) return catRows[0].category_id;

  const [ins] = await db.execute(
    'INSERT INTO vehicle_category (category_name) VALUES (?)', [categoryId]
  );
  return ins.insertId;
};

// ── POST /api/bookings/p2p ────────────────────────────────────────────────────
const createP2PBooking = async (req, res) => {
  const {
    tourType,
    packageId,
    startLocation,
    endLocation,
    selectedCities,
    activities,
    startDate,
    endDate,
    pickupTime,
    totalDays,
    daysRequired,
    categoryId,
    noOfAdults,
    noOfChildren,
    agesOfChildren,
    babySeatNeeded,
    // New structured luggage fields
    luggage10kg,
    luggage25kg,
    luggage35kg,
    luggageCustomCount,
    luggageCustomItems,   // array of { weight: "12" }
    customerName,
    customerPhone,
    notes,
    tourThoughts,
  } = req.body;

  const isPackageBooking = normalizeTourType(tourType) === 'PACKAGE';
  const isCustomBooking  = normalizeTourType(tourType) === 'CUSTOM';
  const selectedCityList = Array.isArray(selectedCities) ? selectedCities.filter(Boolean) : [];
  const activityList     = Array.isArray(activities)     ? activities.filter(Boolean)     : [];

  if (!startDate || !endDate || !categoryId || !customerName || !customerPhone)
    return res.status(400).json({ message: 'Missing required fields.' });

  if (!isPackageBooking && !isCustomBooking && (!startLocation || !endLocation))
    return res.status(400).json({ message: 'Start and end location are required for P2P bookings.' });

  if (isCustomBooking && selectedCityList.length === 0)
    return res.status(400).json({ message: 'Please select at least one city for a customized tour.' });

  if (isPackageBooking && !packageId)
    return res.status(400).json({ message: 'packageId is required for package bookings.' });

  if (!req.user?.id)
    return res.status(401).json({ message: 'Not authenticated.' });

  // Build luggage_custom_desc from per-item weight array
  const customItems = Array.isArray(luggageCustomItems) ? luggageCustomItems : [];
  const luggageCustomDesc = customItems.length
    ? customItems.map((item, i) => `Item ${i + 1}: ${item.weight || '?'}kg`).join(', ')
    : null;

  // Build notes for cities/activities (stored in tour_thoughts to keep notes clean)
  const cityNotes     = selectedCityList.length ? `Cities: ${selectedCityList.join(', ')}`     : null;
  const activityNotes = activityList.length     ? `Activities: ${activityList.join(', ')}`     : null;
  const fullTourThoughts = [tourThoughts || null, cityNotes, activityNotes].filter(Boolean).join(' | ') || null;

  let conn;
  try {
    const resolvedCategoryId = await resolveCategoryId(categoryId);

    conn = await db.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO booking
        (user_id, customer_name, customer_phone,
         tour_type, category_id,
         start_date, end_date, pickup_time,
         start_location, end_location,
         total_days, days_required,
         luggage_10kg, luggage_25kg, luggage_35kg,
         luggage_custom_count, luggage_custom_desc,
         no_of_adults, no_of_children, ages_of_children,
         notes, tour_thoughts,
         booking_status, booking_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', CURDATE())`,
      [
        req.user.id,
        customerName,
        customerPhone,
        isPackageBooking ? 'PACKAGE' : isCustomBooking ? 'CUSTOM' : 'P2P',
        resolvedCategoryId,
        startDate,
        endDate,
        pickupTime        || null,
        isPackageBooking || isCustomBooking ? null : startLocation,
        isPackageBooking || isCustomBooking ? null : endLocation,
        totalDays         || 1,
        daysRequired      || 1,
        luggage10kg       || 0,
        luggage25kg       || 0,
        luggage35kg       || 0,
        luggageCustomCount || 0,
        luggageCustomDesc,
        noOfAdults        || 1,
        noOfChildren      || 0,
        agesOfChildren    || null,
        notes             || null,
        fullTourThoughts,
      ]
    );

    const bookingId = result.insertId;

    if (isPackageBooking) {
      await conn.execute(
        'INSERT INTO booking_package (booking_id, package_id) VALUES (?, ?)',
        [bookingId, packageId]
      );
    }

    if (isCustomBooking) {
      for (const cityName of selectedCityList) {
        await conn.execute(
          'INSERT INTO booking_custom_cities (booking_id, city_name) VALUES (?, ?)',
          [bookingId, cityName]
        );
      }
      for (const actName of activityList) {
        await conn.execute(
          'INSERT INTO booking_custom_activities (booking_id, activity_name) VALUES (?, ?)',
          [bookingId, actName]
        );
      }
    }

    await conn.commit();

    res.status(201).json({
      message: 'Booking submitted successfully.',
      bookingId,
      booking: { id: bookingId },
      bookingRef: `CBT-${isPackageBooking ? 'PKG' : isCustomBooking ? 'CUS' : 'P2P'}-${bookingId}`,
    });

  } catch (err) {
    console.error('createP2PBooking error:', err);
    if (conn) await conn.rollback();
    res.status(500).json({ message: 'Failed to create booking.' });
  } finally {
    if (conn) conn.release();
  }
};

// ── GET /api/bookings/my ──────────────────────────────────────────────────────
const getMyBookings = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT b.*, u.email,
              vc.category_name,
              p.package_id, p.title AS package_name
       FROM booking b
       JOIN user u ON u.user_id = b.user_id
       LEFT JOIN vehicle_category vc ON vc.category_id = b.category_id
       LEFT JOIN booking_package bp ON bp.booking_id = b.booking_id
       LEFT JOIN package p ON p.package_id = bp.package_id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC, b.booking_id DESC`,
      [req.user.id]
    );
    res.json({ bookings: rows.map(mapBooking) });
  } catch (err) {
    console.error('getMyBookings error:', err);
    res.status(500).json({ message: 'Failed to load bookings.' });
  }
};

// ── GET /api/bookings  (admin) ────────────────────────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT b.*, u.email,
              vc.category_name,
              p.package_id, p.title AS package_name,
              v.vehicle_number, v.name AS vehicle_name
       FROM booking b
       JOIN user u ON u.user_id = b.user_id
       LEFT JOIN vehicle_category vc ON vc.category_id = b.category_id
       LEFT JOIN booking_package bp ON bp.booking_id = b.booking_id
       LEFT JOIN package p ON p.package_id = bp.package_id
       LEFT JOIN vehicle v ON v.vehicle_id = b.vehicle_id
       ORDER BY b.booking_date DESC, b.booking_id DESC`
    );
    res.json({ bookings: rows.map(mapBooking) });
  } catch (err) {
    console.error('getAllBookings error:', err);
    res.status(500).json({ message: 'Failed to load bookings.' });
  }
};

// ── PATCH /api/bookings/:id/quote  (admin) ────────────────────────────────────
const setQuote = async (req, res) => {
  const { id } = req.params;
  const { quotedPrice, vehicleId } = req.body;

  if (!quotedPrice)
    return res.status(400).json({ message: 'quotedPrice is required.' });

  try {
    const [result] = await db.execute(
      `UPDATE booking
       SET quoted_price = ?, vehicle_id = ?,
           booking_status = 'QUOTED', quoted_at = NOW()
       WHERE booking_id = ?`,
      [quotedPrice, vehicleId || null, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Booking not found.' });

    res.json({ message: 'Quote sent to customer.' });
  } catch (err) {
    console.error('setQuote error:', err);
    res.status(500).json({ message: 'Failed to set quote.' });
  }
};

// ── PATCH /api/bookings/:id/status ───────────────────────────────────────────
const ALLOWED_TRANSITIONS = {
  CUSTOMER: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ADMIN:    ['CONFIRMED', 'TOUR_STARTED', 'COMPLETED', 'CLOSED', 'CANCELLED'],
};

const STATUS_TIMESTAMP = {
  CONFIRMED:    'confirmed_at',
  TOUR_STARTED: 'tour_started_at',
  COMPLETED:    'completed_at',
  CLOSED:       'closed_at',
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'STAFF'].includes(req.user?.role);
  const allowed = isAdmin ? ALLOWED_TRANSITIONS.ADMIN : ALLOWED_TRANSITIONS.CUSTOMER;

  if (!allowed.includes(status))
    return res.status(400).json({ message: `Status '${status}' is not allowed.` });

  const tsCol    = STATUS_TIMESTAMP[status];
  const tsClause = tsCol ? `, ${tsCol} = NOW()` : '';

  try {
    const [result] = await db.execute(
      `UPDATE booking SET booking_status = ? ${tsClause} WHERE booking_id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Booking not found.' });

    res.json({ message: `Booking status updated to ${status}.` });
  } catch (err) {
    console.error('updateStatus error:', err);
    res.status(500).json({ message: 'Failed to update status.' });
  }
};

// ── PUT /api/bookings/:id ─────────────────────────────────────────────────────
const updateBooking = async (req, res) => {
  const { id } = req.params;
  const {
    tourType,
    startLocation,
    endLocation,
    selectedCities,
    activities,
    startDate,
    endDate,
    pickupTime,
    totalDays,
    daysRequired,
    categoryId,
    noOfAdults,
    noOfChildren,
    agesOfChildren,
    luggage10kg,
    luggage25kg,
    luggage35kg,
    luggageCustomCount,
    luggageCustomItems,
    customerName,
    customerPhone,
    notes,
    tourThoughts,
  } = req.body;

  const isCustomBooking  = normalizeTourType(tourType) === 'CUSTOM';
  const selectedCityList = Array.isArray(selectedCities) ? selectedCities.filter(Boolean) : [];
  const activityList     = Array.isArray(activities)     ? activities.filter(Boolean)     : [];

  if (!startDate || !endDate || !categoryId || !customerName || !customerPhone)
    return res.status(400).json({ message: 'Missing required fields.' });

  const customItems = Array.isArray(luggageCustomItems) ? luggageCustomItems : [];
  const luggageCustomDesc = customItems.length
    ? customItems.map((item, i) => `Item ${i + 1}: ${item.weight || '?'}kg`).join(', ')
    : null;

  const cityNotes     = selectedCityList.length ? `Cities: ${selectedCityList.join(', ')}`  : null;
  const activityNotes = activityList.length     ? `Activities: ${activityList.join(', ')}` : null;
  const fullTourThoughts = [tourThoughts || null, cityNotes, activityNotes].filter(Boolean).join(' | ') || null;

  let conn;
  try {
    const resolvedCategoryId = await resolveCategoryId(categoryId);

    conn = await db.getConnection();
    await conn.beginTransaction();

    const [existing] = await conn.execute(
      'SELECT booking_status, user_id FROM booking WHERE booking_id = ?', [id]
    );

    if (existing.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Booking not found.' });
    }
    if (existing[0].user_id !== req.user.id) {
      await conn.rollback();
      return res.status(403).json({ message: 'Unauthorized to edit this booking.' });
    }
    if (existing[0].booking_status !== 'PENDING') {
      await conn.rollback();
      return res.status(400).json({ message: 'Only pending bookings can be edited.' });
    }

    await conn.execute(
      `UPDATE booking
       SET customer_name = ?, customer_phone = ?,
           category_id = ?,
           start_date = ?, end_date = ?, pickup_time = ?,
           start_location = ?, end_location = ?,
           total_days = ?, days_required = ?,
           luggage_10kg = ?, luggage_25kg = ?, luggage_35kg = ?,
           luggage_custom_count = ?, luggage_custom_desc = ?,
           no_of_adults = ?, no_of_children = ?, ages_of_children = ?,
           notes = ?, tour_thoughts = ?
       WHERE booking_id = ?`,
      [
        customerName, customerPhone,
        resolvedCategoryId,
        startDate, endDate, pickupTime || null,
        startLocation || null, endLocation || null,
        totalDays    || 1, daysRequired || 1,
        luggage10kg  || 0, luggage25kg  || 0, luggage35kg || 0,
        luggageCustomCount || 0, luggageCustomDesc,
        noOfAdults   || 1, noOfChildren || 0, agesOfChildren || null,
        notes || null, fullTourThoughts,
        id,
      ]
    );

    if (isCustomBooking) {
      await conn.execute('DELETE FROM booking_custom_cities     WHERE booking_id = ?', [id]);
      await conn.execute('DELETE FROM booking_custom_activities WHERE booking_id = ?', [id]);

      for (const cityName of selectedCityList) {
        await conn.execute(
          'INSERT INTO booking_custom_cities (booking_id, city_name) VALUES (?, ?)',
          [id, cityName]
        );
      }
      for (const actName of activityList) {
        await conn.execute(
          'INSERT INTO booking_custom_activities (booking_id, activity_name) VALUES (?, ?)',
          [id, actName]
        );
      }
    }

    await conn.commit();
    res.json({ message: 'Booking updated successfully.' });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error('updateBooking error:', err);
    res.status(500).json({ message: 'Failed to update booking.' });
  } finally {
    if (conn) conn.release();
  }
};

// ── GET /api/bookings/:id/confirmation-pdf ──────────────────────────────────
const downloadBookingConfirmationPdf = async (req, res) => {
  const { id } = req.params;
  const bookingId = Number(id);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return res.status(400).json({ message: 'Invalid booking id.' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT b.*,
              vc.category_name,
              p.title AS package_name
       FROM booking b
       LEFT JOIN vehicle_category vc ON vc.category_id = b.category_id
       LEFT JOIN booking_package bp ON bp.booking_id = b.booking_id
       LEFT JOIN package p ON p.package_id = bp.package_id
       WHERE b.booking_id = ?
       LIMIT 1`,
      [bookingId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const booking = rows[0];

    if (Number(booking.user_id) !== Number(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized to access this booking document.' });
    }

    if (!PDF_ALLOWED_STATUSES.includes(booking.booking_status)) {
      return res.status(400).json({ message: 'Booking confirmation PDF is available after quote acceptance.' });
    }

    const bookingRef = getBookingReference(booking.tour_type, booking.booking_id);
    const startDate = formatDate(booking.start_date);
    const endDate = formatDate(booking.end_date);
    const legacySmallLuggage = Number(booking.small_luggages || 0);
    const legacyLargeLuggage = Number(booking.large_luggages || 0);
    const totalLuggage =
      Number(booking.luggage_10kg || 0) +
      Number(booking.luggage_25kg || 0) +
      Number(booking.luggage_35kg || 0) +
      Number(booking.luggage_custom_count || 0) +
      legacySmallLuggage +
      legacyLargeLuggage;
    const quotedPrice = formatMoney(booking.quoted_price);
    const paymentSchedule = getPaymentScheduleLines(booking.tour_type, booking.quoted_price);
    const fileName = `booking-confirmation-${bookingRef}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.on('error', (pdfErr) => {
      console.error('PDF stream error:', pdfErr);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Failed to generate booking confirmation PDF.' });
      }
    });
    doc.pipe(res);

    doc.rect(0, 0, doc.page.width, 90).fill('#00b0a5');
    doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text(COMPANY_NAME, 50, 30);
    doc.fontSize(11).font('Helvetica').text('Booking Confirmation', 50, 58);

    doc.moveDown(4);
    doc.fillColor('#0f172a').fontSize(11);

    const writeRow = (label, value) => {
      doc.font('Helvetica-Bold').text(`${label}: `, { continued: true });
      doc.font('Helvetica').text(value || 'N/A');
      doc.moveDown(0.25);
    };

    writeRow('Booking Reference', bookingRef);
    writeRow('Customer Name', booking.customer_name);
    writeRow('Customer Phone', booking.customer_phone);
    writeRow('Tour Type', normalizeTourType(booking.tour_type));
    writeRow('Selected Package', booking.package_name || 'Not applicable');
    writeRow('Start Date', startDate || 'N/A');
    writeRow('End Date', endDate || 'N/A');
    writeRow('Vehicle Category', booking.category_name || 'N/A');
    writeRow('Adults', String(booking.no_of_adults || 0));
    writeRow('Children', String(booking.no_of_children || 0));
    writeRow('Luggage Items', String(totalLuggage));
    writeRow('Quoted Price', quotedPrice);
    writeRow('Confirmed Price', quotedPrice);

    doc.moveDown(0.6);
    doc.font('Helvetica-Bold').fontSize(12).text('Payment Schedule');
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(11);
    paymentSchedule.forEach((line) => {
      doc.text(`- ${line}`);
    });

    doc.moveDown(1.1);
    doc.fillColor('#64748b').fontSize(9);
    doc.text(`Issued by ${COMPANY_NAME}`);
    doc.text(`Generated on ${new Date().toISOString().slice(0, 10)}`);

    doc.end();
  } catch (err) {
    console.error('downloadBookingConfirmationPdf error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate booking confirmation PDF.' });
    }
  }
};

module.exports = {
  createP2PBooking,
  getMyBookings,
  getAllBookings,
  setQuote,
  updateStatus,
  updateBooking,
  downloadBookingConfirmationPdf,
};
