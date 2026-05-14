const db = require('../db/connection'); 

const formatDate = (val) => {
  if (!val) return null;
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  return new Date(val).toISOString().split('T')[0];
};

const normalizeTourType = (value) => String(value || 'P2P').toUpperCase();

// ── Helpers ───────────────────────────────────────────────────────────────────
const mapBooking = (row) => ({
  id:             row.booking_id,
  customerId:     row.customer_id,
  customerName:   row.customer_name,
  customerPhone:  row.customer_phone,
  customerEmail:  row.customer_email || null,
  tourType:       row.tour_type,
  categoryId:     row.category_id,
  categoryName:   row.category_name || null,
  packageId:      row.package_id || null,
  packageName:    row.package_name || null,
  vehicleId:      row.vehicle_id || null,
  assignedVehicle: row.vehicle_name ? {
    name:        row.vehicle_name,
    plateNumber: row.vehicle_number || '—',
    type:        row.category_name  || '',
  } : null,
  startDate:      formatDate(row.start_date),
  endDate:        formatDate(row.end_date),
  bookingDate:    formatDate(row.booking_date),
  startLocation:  row.start_location,
  endLocation:    row.end_location,
  totalDays:      row.total_days,
  daysRequired:   row.days_required,
  noOfLuggages:   row.no_of_luggages,
  noOfAdults:     row.no_of_adults,
  noOfChildren:   row.no_of_children,
  agesOfChildren: row.ages_of_children,
  quotedPrice:    row.quoted_price ? parseFloat(row.quoted_price) : null,
  notes:          row.notes,
  status:         row.booking_status,
  quotedAt:       row.quoted_at,
  confirmedAt:    row.confirmed_at,
  tourStartedAt:  row.tour_started_at,
  completedAt:    row.completed_at,
  closedAt:       row.closed_at,
});

// ── POST /api/bookings/p2p ────────────────────────────────────────────────────
const createP2PBooking = async (req, res) => {
  const {
    tourType,
    packageId,
    packageName,
    startLocation,
    endLocation,
    selectedCities,
    activities,
    startDate,
    endDate,
    pickupTime,       // stored in notes prefix
    totalDays,
    daysRequired,
    categoryId,
    noOfAdults,
    noOfChildren,
    agesOfChildren,
    babySeatNeeded,
    smallLuggages,
    largeLuggages,
    customerName,
    customerPhone,
    notes,
  } = req.body;

  const isPackageBooking = normalizeTourType(tourType) === 'PACKAGE';
  const isCustomBooking = normalizeTourType(tourType) === 'CUSTOM';
  const selectedCityList = Array.isArray(selectedCities) ? selectedCities.filter(Boolean) : [];
  const activityList = Array.isArray(activities) ? activities.filter(Boolean) : [];

  // Basic validation
  if (!startDate || !endDate || !categoryId || !customerName || !customerPhone)
    return res.status(400).json({ message: 'Missing required fields.' });

  if (!isPackageBooking && !isCustomBooking && (!startLocation || !endLocation))
    return res.status(400).json({ message: 'Missing required fields.' });

  if (isCustomBooking && selectedCityList.length === 0)
    return res.status(400).json({ message: 'Please select at least one city for a customized tour.' });

  if (isPackageBooking && !packageId)
    return res.status(400).json({ message: 'packageId is required for package bookings.' });

  if (!req.user?.id)
    return res.status(401).json({ message: 'Not authenticated.' });

  // Build luggage string and full notes
  const luggageStr = `Small: ${smallLuggages || 0}, Large: ${largeLuggages || 0}${babySeatNeeded ? ', Baby seat needed' : ''}`;
  const cityNotes = selectedCityList.length ? `Cities: ${selectedCityList.join(', ')}` : null;
  const activityNotes = activityList.length ? `Activities: ${activityList.join(', ')}` : null;
  const fullNotes = [
    pickupTime ? `Pickup time: ${pickupTime}` : null,
    cityNotes,
    activityNotes,
    notes || null,
  ].filter(Boolean).join(' | ');

  // Resolve string category name → integer FK
  let resolvedCategoryId = null;
  if (!isNaN(categoryId)) {
    resolvedCategoryId = parseInt(categoryId);
  } else {
  const [catRows] = await db.execute(
    'SELECT category_id FROM vehicle_category WHERE category_name = ? LIMIT 1',
    [categoryId]
  );
  if (catRows.length > 0) {
    resolvedCategoryId = catRows[0].category_id;
  } else {
    const [ins] = await db.execute(
      'INSERT INTO vehicle_category (category_name) VALUES (?)', [categoryId]
    );
    resolvedCategoryId = ins.insertId;
  }
}

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO booking
        (user_id, customer_name, customer_phone,
         tour_type, category_id,
         start_date, end_date, start_location, end_location,
         total_days, days_required,
         no_of_adults, no_of_children, ages_of_children,
         no_of_luggages, notes,
         booking_status, booking_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', CURDATE())`,
      [
        req.user.id,
        customerName,
        customerPhone,
        isPackageBooking ? 'PACKAGE' : isCustomBooking ? 'CUSTOM' : 'P2P',
        resolvedCategoryId,
        startDate,
        endDate,
        isPackageBooking || isCustomBooking ? null : startLocation,
        isPackageBooking || isCustomBooking ? null : endLocation,
        totalDays  || 1,
        daysRequired || 1,
        noOfAdults || 1,
        noOfChildren || 0,
        agesOfChildren || null,
        luggageStr,
        fullNotes || null,
      ]
    );

    if (isPackageBooking) {
      await conn.execute(
        'INSERT INTO booking_package (booking_id, package_id) VALUES (?, ?)',
        [result.insertId, packageId]
      );
    }

    await conn.commit();

    res.status(201).json({
      message: 'Booking submitted successfully.',
      bookingId: result.insertId,
      bookingRef: `CBT-${isPackageBooking ? 'PKG' : 'P2P'}-${result.insertId}`,
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
      `SELECT b.*, u.email, vc.category_name
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

// ── GET /api/bookings  (admin — all bookings) ─────────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT b.*, u.email, vc.category_name,
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

// ── PATCH /api/bookings/:id/quote  (admin sets price + vehicle) ───────────────
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

  const tsCol   = STATUS_TIMESTAMP[status];
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

module.exports = {
  createP2PBooking,
  getMyBookings,
  getAllBookings,
  setQuote,
  updateStatus,
};
