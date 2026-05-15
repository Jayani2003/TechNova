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
    pickupTime,
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
    tourThoughts,
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
  const thoughtsNotes = tourThoughts ? `Traveler Thoughts: ${tourThoughts}` : null;
  const fullNotes = [
    pickupTime ? `Pickup time: ${pickupTime}` : null,
    cityNotes,
    activityNotes,
    thoughtsNotes,
    notes || null,
  ].filter(Boolean).join(' | ');

  // string category name → integer FK
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
         no_of_luggages, notes, tour_thoughts,
         booking_status, booking_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', CURDATE())`,
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
        tourThoughts || null,
      ]
    );

    const bookingId = result.insertId;

    if (isPackageBooking) {
      await conn.execute(
        'INSERT INTO booking_package (booking_id, package_id) VALUES (?, ?)',
        [result.insertId, packageId]
      );
    }

    // ── Handle Custom Selections ──────────────────────────────────────────────
    if (isCustomBooking) {
      if (selectedCityList.length > 0) {
        for (let i = 0; i < selectedCityList.length; i++) {
          const cityName = selectedCityList[i];
          // Try to find place_id
          const [places] = await conn.execute('SELECT place_id FROM place WHERE place_name = ? LIMIT 1', [cityName]);
          const placeId = places.length > 0 ? places[0].place_id : null;

          await conn.execute(
            'INSERT INTO booking_custom_cities (booking_id, place_id, custom_name, sequence_order) VALUES (?, ?, ?, ?)',
            [bookingId, placeId, placeId ? null : cityName, i]
          );
        }
      }
      if (activityList.length > 0) {
        for (const actName of activityList) {
          // Try to find activity_id
          const [activities] = await conn.execute('SELECT activity_id FROM activity WHERE activity_name = ? LIMIT 1', [actName]);
          
          if (activities.length > 0) {
            await conn.execute(
              'INSERT INTO booking_custom_activities (booking_id, activity_id) VALUES (?, ?)',
              [bookingId, activities[0].activity_id]
            );
          } else {
            // If not found, we could either skip or insert into activity table first. 
            // For now, let's try to insert into activity table to ensure the link works.
            const [newAct] = await conn.execute('INSERT INTO activity (activity_name) VALUES (?)', [actName]);
            await conn.execute(
              'INSERT INTO booking_custom_activities (booking_id, activity_id) VALUES (?, ?)',
              [bookingId, newAct.insertId]
            );
          }
        }
      }
    }

    await conn.commit();

    res.status(201).json({
      message: 'Booking submitted successfully.',
      bookingId: result.insertId,
      bookingRef: `CBT-${isPackageBooking ? 'PKG' : isCustomBooking ? 'CUS' : 'P2P'}-${result.insertId}`,
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
    babySeatNeeded,
    smallLuggages,
    largeLuggages,
    customerName,
    customerPhone,
    notes,
    tourThoughts,
  } = req.body;

  const isCustomBooking = String(tourType).toUpperCase() === 'CUSTOM';
  const selectedCityList = Array.isArray(selectedCities) ? selectedCities.filter(Boolean) : [];
  const activityList = Array.isArray(activities) ? activities.filter(Boolean) : [];

  if (!startDate || !endDate || !categoryId || !customerName || !customerPhone)
    return res.status(400).json({ message: 'Missing required fields.' });

  // Luggage string and full notes (same logic as create)
  const luggageStr = `Small: ${smallLuggages || 0}, Large: ${largeLuggages || 0}${babySeatNeeded ? ', Baby seat needed' : ''}`;
  const cityNotes = selectedCityList.length ? `Cities: ${selectedCityList.join(', ')}` : null;
  const activityNotes = activityList.length ? `Activities: ${activityList.join(', ')}` : null;
  const thoughtsNotes = tourThoughts ? `Traveler Thoughts: ${tourThoughts}` : null;
  const fullNotes = [
    pickupTime ? `Pickup time: ${pickupTime}` : null,
    cityNotes,
    activityNotes,
    thoughtsNotes,
    notes || null,
  ].filter(Boolean).join(' | ');

  // Resolve category ID
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

    // Check if booking exists, belongs to user, and is PENDING
    const [existing] = await conn.execute(
      'SELECT booking_status, user_id FROM booking WHERE booking_id = ?',
      [id]
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
           category_id = ?, start_date = ?, end_date = ?,
           start_location = ?, end_location = ?,
           total_days = ?, days_required = ?,
           no_of_adults = ?, no_of_children = ?, ages_of_children = ?,
           no_of_luggages = ?, notes = ?, tour_thoughts = ?
       WHERE booking_id = ?`,
      [
        customerName, customerPhone,
        resolvedCategoryId, startDate, endDate,
        startLocation || null, endLocation || null,
        totalDays || 1, daysRequired || 1,
        noOfAdults || 1, noOfChildren || 0, agesOfChildren || null,
        luggageStr, fullNotes || null, tourThoughts || null,
        id
      ]
    );

    // Refresh custom selections if it's a custom booking
    if (isCustomBooking) {
      await conn.execute('DELETE FROM booking_custom_cities WHERE booking_id = ?', [id]);
      await conn.execute('DELETE FROM booking_custom_activities WHERE booking_id = ?', [id]);

      if (selectedCityList.length > 0) {
        for (let i = 0; i < selectedCityList.length; i++) {
          const cityName = selectedCityList[i];
          const [places] = await conn.execute('SELECT place_id FROM place WHERE place_name = ? LIMIT 1', [cityName]);
          const placeId = places.length > 0 ? places[0].place_id : null;

          await conn.execute(
            'INSERT INTO booking_custom_cities (booking_id, place_id, custom_name, sequence_order) VALUES (?, ?, ?, ?)',
            [id, placeId, placeId ? null : cityName, i]
          );
        }
      }
      if (activityList.length > 0) {
        for (const actName of activityList) {
          const [activities] = await conn.execute('SELECT activity_id FROM activity WHERE activity_name = ? LIMIT 1', [actName]);
          let actId = activities.length > 0 ? activities[0].activity_id : null;

          if (!actId) {
            const [newAct] = await conn.execute('INSERT INTO activity (activity_name) VALUES (?)', [actName]);
            actId = newAct.insertId;
          }

          await conn.execute(
            'INSERT INTO booking_custom_activities (booking_id, activity_id) VALUES (?, ?)',
            [id, actId]
          );
        }
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

module.exports = {
  createP2PBooking,
  getMyBookings,
  getAllBookings,
  setQuote,
  updateStatus,
  updateBooking,
};
