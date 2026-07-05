const db = require('../db/connection');

const normalizeTourType = (value) => String(value || 'P2P').toUpperCase();
const getBookingReference = (tourType, bookingId) => {
  const type = normalizeTourType(tourType);
  const typeCode = type === 'PACKAGE' ? 'PKG' : type === 'CUSTOM' ? 'CUS' : 'P2P';
  return `CBT-${typeCode}-${bookingId}`;
};

// Helper to add or subtract days to a date string
const modifyDays = (dateStr, days) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

// Helper to format currency
const formatLKR = (val) => {
  return `LKR ${Number(val).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// GET /api/payments (Admin only)
const getAllPayments = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.payment_id, p.booking_id, p.installment, p.amount, p.payment_method, p.received_date, p.notes, p.status, p.slip_url,
             b.tour_type, b.quoted_price, b.start_date, b.end_date, b.customer_name, b.customer_phone,
             u.name AS recorded_by_name,
             c.email AS customer_email
      FROM payment p
      JOIN booking b ON p.booking_id = b.booking_id
      LEFT JOIN user u ON p.recorded_by = u.user_id
      JOIN user c ON b.user_id = c.user_id
      ORDER BY FIELD(p.status, 'PENDING', 'APPROVED', 'REJECTED'), p.payment_id DESC
    `);

    const payments = rows.map((r) => ({
      id: `PAY${String(r.payment_id).padStart(3, '0')}`,
      rawId: r.payment_id,
      bookingId: getBookingReference(r.tour_type, r.booking_id),
      booking_id: r.booking_id,
      tourType: r.tour_type === 'PACKAGE' ? 'Package Tour' : r.tour_type === 'CUSTOM' ? 'Customized' : 'P2P Tour',
      customerName: r.customer_name,
      customerPhone: r.customer_phone,
      customerEmail: r.customer_email,
      type: r.installment === 'DEPOSIT' ? 'Deposit' : r.installment === 'FINAL' ? 'Final' : 'Full Payment',
      typePercent: r.installment === 'FULL' ? '100%' : '50%',
      amount: formatLKR(r.amount),
      rawAmount: parseFloat(r.amount),
      method: r.payment_method === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Cash',
      date: r.received_date ? r.received_date.toISOString().split('T')[0] : 'Pending',
      time: '12:00 PM', 
      status: r.status.toLowerCase(), // 'pending', 'approved', 'rejected'
      notes: r.notes,
      recordedBy: r.recorded_by_name || 'Customer',
      totalAmount: formatLKR(r.quoted_price),
      tourDates: `${r.start_date.toISOString().split('T')[0]} to ${r.end_date.toISOString().split('T')[0]}`,
      slip: r.slip_url ? {
        filename: r.slip_url.split('/').pop().slice(-20),
        size: 'Cloudinary Upload',
        uploadedAt: r.received_date ? r.received_date.toISOString().split('T')[0] : 'Pending',
        previewUrl: r.slip_url
      } : null
    }));

    res.json({ payments });
  } catch (err) {
    console.error('getAllPayments error:', err);
    res.status(500).json({ message: 'Failed to retrieve payments.' });
  }
};

// GET /api/payments/booking/:bookingId (Owner or Admin)
const getPaymentsForBooking = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'STAFF'].includes(req.user.role);

  try {
    // 1. Fetch booking details
    const [bookingRows] = await db.execute(`
      SELECT b.*, vc.category_name, v.name as vehicle_name, v.vehicle_number
      FROM booking b
      LEFT JOIN vehicle_category vc ON b.category_id = vc.category_id
      LEFT JOIN vehicle v ON b.vehicle_id = v.vehicle_id
      WHERE b.booking_id = ?
    `, [bookingId]);

    if (bookingRows.length === 0) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const booking = bookingRows[0];

    // Check ownership if not admin
    if (!isAdmin && booking.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // 2. Fetch payments recorded for this booking
    const [paymentRows] = await db.execute(`
      SELECT p.*, u.name AS recorded_by_name
      FROM payment p
      LEFT JOIN user u ON p.recorded_by = u.user_id
      WHERE p.booking_id = ?
      ORDER BY p.received_date ASC, p.payment_id ASC
    `, [bookingId]);

    const price = booking.quoted_price ? parseFloat(booking.quoted_price) : 0;
    const tourType = booking.tour_type; // 'P2P', 'PACKAGE', 'CUSTOM'
    const start_date = booking.start_date ? booking.start_date.toISOString().split('T')[0] : null;
    const end_date = booking.end_date ? booking.end_date.toISOString().split('T')[0] : null;

    // Sum of APPROVED payments counts towards paidAmount
    const approvedPayments = paymentRows.filter(p => p.status === 'APPROVED');
    const paidAmount = approvedPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const remainingAmount = Math.max(0, price - paidAmount);

    const todayStr = new Date().toISOString().split('T')[0];

    // Compute expected installments based on rules
    const installments = [];
    let nextPaymentNote = '';

    if (price > 0) {
      if (tourType === 'P2P') {
        const approvedFull = paymentRows.find(p => p.installment === 'FULL' && p.status === 'APPROVED');
        const pendingFull = paymentRows.find(p => p.installment === 'FULL' && p.status === 'PENDING');
        const rejectedFull = paymentRows.find(p => p.installment === 'FULL' && p.status === 'REJECTED');
        
        let status = 'PENDING';
        let statusNote = 'Payment pending';
        
        if (approvedFull || paidAmount >= price) {
          status = 'PAID';
          statusNote = `Paid on ${approvedFull ? approvedFull.received_date.toISOString().split('T')[0] : todayStr}`;
        } else if (pendingFull) {
          status = 'PENDING';
          statusNote = 'Pending verification';
        } else if (todayStr > end_date) {
          status = 'OVERDUE';
          statusNote = 'Payment overdue';
        }

        installments.push({
          id: 1,
          number: 1,
          type: 'Full Payment',
          typeLabel: '100% of total',
          amount: formatLKR(price),
          rawAmount: price,
          dueDate: end_date,
          dueDateNote: 'After the tour ends',
          status: status,
          statusNote: statusNote
        });

        if (status !== 'PAID' && status !== 'PENDING') {
          nextPaymentNote = `Full payment of ${formatLKR(price)} is due on ${end_date} (After the tour ends).`;
        } else if (status === 'PENDING') {
          nextPaymentNote = 'Verification in progress for your uploaded full payment.';
        } else {
          nextPaymentNote = 'Fully paid. No outstanding balance.';
        }
      } else {
        const depositAmt = price * 0.5;
        const finalAmt = price * 0.5;
        const depositDueDate = modifyDays(start_date, 2);
        const finalDueDate = modifyDays(end_date, -1);

        // Deposit status
        const approvedDeposit = paymentRows.find(p => p.installment === 'DEPOSIT' && p.status === 'APPROVED');
        const pendingDeposit = paymentRows.find(p => p.installment === 'DEPOSIT' && p.status === 'PENDING');
        
        let depStatus = 'PENDING';
        let depStatusNote = 'Payment pending';
        
        if (approvedDeposit || paidAmount >= depositAmt) {
          depStatus = 'PAID';
          depStatusNote = `Paid on ${approvedDeposit ? approvedDeposit.received_date.toISOString().split('T')[0] : todayStr}`;
        } else if (pendingDeposit) {
          depStatus = 'PENDING';
          depStatusNote = 'Pending verification';
        } else if (todayStr > depositDueDate) {
          depStatus = 'OVERDUE';
          depStatusNote = 'Payment overdue';
        }

        installments.push({
          id: 1,
          number: 1,
          type: 'Deposit',
          typeLabel: '50% of total',
          amount: formatLKR(depositAmt),
          rawAmount: depositAmt,
          dueDate: depositDueDate,
          dueDateNote: 'Within 2 days of tour start',
          status: depStatus,
          statusNote: depStatusNote
        });

        // Final status
        const approvedFinal = paymentRows.find(p => p.installment === 'FINAL' && p.status === 'APPROVED');
        const pendingFinal = paymentRows.find(p => p.installment === 'FINAL' && p.status === 'PENDING');
        
        let finalStatus = 'PENDING';
        let finalStatusNote = 'Payment pending';
        
        if (approvedFinal || paidAmount >= price) {
          finalStatus = 'PAID';
          finalStatusNote = `Paid on ${approvedFinal ? approvedFinal.received_date.toISOString().split('T')[0] : todayStr}`;
        } else if (pendingFinal) {
          finalStatus = 'PENDING';
          finalStatusNote = 'Pending verification';
        } else if (todayStr > finalDueDate) {
          finalStatus = 'OVERDUE';
          finalStatusNote = 'Payment overdue';
        }

        installments.push({
          id: 2,
          number: 2,
          type: 'Final Payment',
          typeLabel: 'Remaining 50%',
          amount: formatLKR(finalAmt),
          rawAmount: finalAmt,
          dueDate: finalDueDate,
          dueDateNote: 'Before the last day of tour',
          status: finalStatus,
          statusNote: finalStatusNote
        });

        if (depStatus !== 'PAID' && depStatus !== 'PENDING') {
          nextPaymentNote = `Deposit of ${formatLKR(depositAmt)} is due on ${depositDueDate} (Within 2 days of tour start).`;
        } else if (depStatus === 'PENDING') {
          nextPaymentNote = 'Verification in progress for deposit payment proof.';
        } else if (finalStatus !== 'PAID' && finalStatus !== 'PENDING') {
          nextPaymentNote = `Final payment of ${formatLKR(finalAmt)} is due on ${finalDueDate} (Before the last day of the tour).`;
        } else if (finalStatus === 'PENDING') {
          nextPaymentNote = 'Verification in progress for final payment proof.';
        } else {
          nextPaymentNote = 'Fully paid. No outstanding balance.';
        }
      }
    } else {
      nextPaymentNote = 'Price is not yet quoted by admin.';
    }

    // Format transaction history (shows all attempts)
    const transactions = paymentRows.map(p => ({
      id: `TX${String(p.payment_id).padStart(3, '0')}`,
      rawId: p.payment_id,
      date: p.received_date ? p.received_date.toISOString().split('T')[0] : 'Pending',
      type: p.installment === 'DEPOSIT' ? 'Deposit' : p.installment === 'FINAL' ? 'Final Payment' : 'Full Payment',
      amount: formatLKR(p.amount),
      method: p.payment_method === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Cash',
      status: p.status === 'APPROVED' ? 'VERIFIED' : p.status === 'REJECTED' ? 'REJECTED' : 'PENDING VERIFICATION',
      recordedBy: p.recorded_by_name || 'Customer',
      notes: p.notes,
      slipUrl: p.slip_url,
      tourId: getBookingReference(booking.tour_type, booking.booking_id),
    }));

    res.json({
      bookingId: bookingId,
      bookingReference: getBookingReference(booking.tour_type, booking.booking_id),
      tourType: booking.tour_type,
      startLocation: booking.start_location,
      endLocation: booking.end_location,
      startDate: start_date,
      endDate: end_date,
      totalAmount: price,
      paidAmount: paidAmount,
      remainingAmount: remainingAmount,
      nextPaymentNote: nextPaymentNote,
      installments: installments,
      transactions: transactions
    });
  } catch (err) {
    console.error('getPaymentsForBooking error:', err);
    res.status(500).json({ message: 'Failed to retrieve booking payments.' });
  }
};

// POST /api/payments (Admin only - Direct record cash/bank)
const recordPayment = async (req, res) => {
  const { booking_id, installment, amount, payment_method, received_date, notes } = req.body;
  const adminId = req.user.id; 

  if (!booking_id || !installment || !amount || !payment_method || !received_date) {
    return res.status(400).json({ message: 'All fields (booking_id, installment, amount, payment_method, received_date) are required.' });
  }

  try {
    const [bookingRows] = await db.execute('SELECT * FROM booking WHERE booking_id = ?', [booking_id]);
    if (bookingRows.length === 0) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const [result] = await db.execute(`
      INSERT INTO payment (booking_id, installment, amount, payment_method, received_date, recorded_by, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, 'APPROVED', ?)
    `, [booking_id, installment, amount, payment_method, received_date, adminId, notes || null]);

    res.status(201).json({
      message: 'Payment recorded successfully.',
      payment_id: result.insertId
    });
  } catch (err) {
    console.error('recordPayment error:', err);
    res.status(500).json({ message: 'Failed to record payment.' });
  }
};

// POST /api/payments/upload-slip (Customer uploads payment proof)
const uploadPaymentSlip = async (req, res) => {
  const { booking_id, installment, amount, notes } = req.body;
  const slipFile = req.file;

  if (!booking_id || !installment || !amount) {
    return res.status(400).json({ message: 'booking_id, installment, and amount are required.' });
  }

  if (!slipFile) {
    return res.status(400).json({ message: 'Payment slip file is required.' });
  }

  try {
    const [bookingRows] = await db.execute('SELECT * FROM booking WHERE booking_id = ?', [booking_id]);
    if (bookingRows.length === 0) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Insert payment record with PENDING status and slip_url, without admin and received_date
    const [result] = await db.execute(`
      INSERT INTO payment (booking_id, installment, amount, payment_method, received_date, status, slip_url, notes)
      VALUES (?, ?, ?, 'BANK_TRANSFER', CURDATE(), 'PENDING', ?, ?)
    `, [booking_id, installment, amount, slipFile.path, notes || 'Uploaded by Customer']);

    res.status(201).json({
      message: 'Payment slip uploaded successfully. Under review by admin.',
      payment_id: result.insertId,
      slip_url: slipFile.path
    });
  } catch (err) {
    console.error('uploadPaymentSlip error:', err);
    res.status(500).json({ message: 'Failed to upload payment slip.' });
  }
};

// PATCH /api/payments/:paymentId/approve (Admin only)
const approvePayment = async (req, res) => {
  const { paymentId } = req.params;
  const adminId = req.user.id;
  const { notes } = req.body;

  try {
    const [result] = await db.execute(`
      UPDATE payment
      SET status = 'APPROVED', received_date = CURDATE(), recorded_by = ?, notes = COALESCE(?, notes)
      WHERE payment_id = ?
    `, [adminId, notes || null, paymentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment record not found.' });
    }

    res.json({ message: 'Payment approved successfully.' });
  } catch (err) {
    console.error('approvePayment error:', err);
    res.status(500).json({ message: 'Failed to approve payment.' });
  }
};

// PATCH /api/payments/:paymentId/reject (Admin only)
const rejectPayment = async (req, res) => {
  const { paymentId } = req.params;
  const adminId = req.user.id;
  const { notes } = req.body;

  try {
    const [result] = await db.execute(`
      UPDATE payment
      SET status = 'REJECTED', recorded_by = ?, notes = ?
      WHERE payment_id = ?
    `, [adminId, notes || 'Rejected by Admin', paymentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment record not found.' });
    }

    res.json({ message: 'Payment rejected successfully.' });
  } catch (err) {
    console.error('rejectPayment error:', err);
    res.status(500).json({ message: 'Failed to reject payment.' });
  }
};

module.exports = {
  getAllPayments,
  getPaymentsForBooking,
  recordPayment,
  uploadPaymentSlip,
  approvePayment,
  rejectPayment
};
