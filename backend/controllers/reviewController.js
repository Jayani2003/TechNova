const pool = require('../db/connection');

const normalizeImageUrls = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [];
};

const getPublishedReviews = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        r.review_id,
        r.booking_id,
        r.rating,
        r.driver_name,
        r.title,
        r.feedback,
        r.tour_title,
        r.tour_type,
        r.verified,
        r.created_at,
        c.name AS customer_name,
        c.country AS customer_country
      FROM review r
      INNER JOIN customer c ON c.customer_id = r.customer_id
      ORDER BY r.created_at DESC
      `
    );

    const [images] = await pool.query(
      `
      SELECT review_id, image_url
      FROM review_image
      `
    );

    const imagesByReviewId = images.reduce((acc, item) => {
      if (!acc[item.review_id]) acc[item.review_id] = [];
      acc[item.review_id].push(item.image_url);
      return acc;
    }, {});

    const reviews = rows.map((row) => ({
      id: `r-${row.review_id}`,
      bookingId: row.booking_id,
      user: {
        name: row.customer_name,
        country: row.customer_country || 'Sri Lanka',
        countryFlag: '🏳️',
        avatar: null,
      },
      tourTitle: row.tour_title || 'Tour Booking',
      tourType: row.tour_type || 'Tour',
      stars: row.rating,
      driverName: row.driver_name || '',
      title: row.title || 'Guest Review',
      comment: row.feedback,
      images: imagesByReviewId[row.review_id] || [],
      datePublished: new Date(row.created_at).toISOString().split('T')[0],
      verified: Boolean(row.verified),
    }));

    res.json({ reviews });
  } catch (error) {
    console.error('getPublishedReviews failed:', error);
    res.status(500).json({ message: 'Failed to load reviews.' });
  }
};

const getReviewableTours = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: 'email is required.' });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT
        b.booking_id,
        b.tour_type,
        b.booking_date,
        b.completed_at,
        p.title AS package_title
      FROM booking b
      INNER JOIN customer c ON c.customer_id = b.customer_id
      LEFT JOIN booking_package bp ON bp.booking_id = b.booking_id
      LEFT JOIN package p ON p.package_id = bp.package_id
      LEFT JOIN review r ON r.booking_id = b.booking_id
      WHERE c.email = ?
        AND b.booking_status = 'COMPLETED'
        AND r.review_id IS NULL
      ORDER BY COALESCE(b.completed_at, b.booking_date) DESC
      `,
      [email]
    );

    const tours = rows.map((row) => ({
      id: String(row.booking_id),
      packageTitle: row.package_title || `${row.tour_type} Booking`,
      packageType: row.tour_type,
      completedDate: row.completed_at
        ? new Date(row.completed_at).toISOString().split('T')[0]
        : new Date(row.booking_date).toISOString().split('T')[0],
    }));

    res.json({ tours });
  } catch (error) {
    console.error('getReviewableTours failed:', error);
    res.status(500).json({ message: 'Failed to load reviewable tours.' });
  }
};

const createReview = async (req, res) => {
  const {
    customerEmail,
    bookingId,
    stars,
    driverName,
    title,
    comment,
    tourTitle,
    tourType,
    images,
  } = req.body;

  if (!customerEmail || !bookingId || !stars || !comment) {
    return res.status(400).json({
      message: 'customerEmail, bookingId, stars and comment are required.',
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [bookingRows] = await conn.query(
      `
      SELECT b.booking_id, b.customer_id, b.booking_status
      FROM booking b
      INNER JOIN customer c ON c.customer_id = b.customer_id
      WHERE b.booking_id = ? AND c.email = ?
      LIMIT 1
      `,
      [bookingId, customerEmail]
    );

    if (bookingRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Booking not found for this user.' });
    }

    const booking = bookingRows[0];
    if (booking.booking_status !== 'COMPLETED') {
      await conn.rollback();
      return res.status(400).json({ message: 'Review allowed only for completed tours.' });
    }

    const [existing] = await conn.query(
      'SELECT review_id FROM review WHERE booking_id = ? LIMIT 1',
      [bookingId]
    );
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(409).json({ message: 'Review already exists for this booking.' });
    }

    const [insertReview] = await conn.query(
      `
      INSERT INTO review (
        customer_id,
        booking_id,
        rating,
        driver_name,
        title,
        feedback,
        tour_title,
        tour_type,
        verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        booking.customer_id,
        bookingId,
        stars,
        driverName || null,
        title || null,
        comment,
        tourTitle || null,
        tourType || null,
        1,
      ]
    );

    const reviewId = insertReview.insertId;
    const imageUrls = normalizeImageUrls(images);

    for (const url of imageUrls) {
      await conn.query(
        'INSERT INTO review_image (review_id, image_url) VALUES (?, ?)',
        [reviewId, url]
      );
    }

    await conn.commit();
    res.status(201).json({
      message: 'Review created successfully.',
      reviewId,
    });
  } catch (error) {
    await conn.rollback();
    console.error('createReview failed:', error);
    res.status(500).json({ message: 'Failed to create review.' });
  } finally {
    conn.release();
  }
};

module.exports = {
  getPublishedReviews,
  getReviewableTours,
  createReview,
};
