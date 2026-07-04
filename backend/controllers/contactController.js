const db = require('../db/connection');

// ── mapInquiry ────────────────────────────────────────────────────────────────
const mapInquiry = (row) => ({
  id:            row.inquiry_id,
  customerName:  row.sender_name,
  customerEmail: row.sender_email,
  customerPhone: row.sender_phone  || null,
  subject:       row.subject       || null,
  message:       row.message,
  isRead:        !!row.is_read,
  status:        row.status,
  createdAt:     row.submitted_at,
  replies:       [],
});

const mapReply = (row) => ({
  id:        row.reply_id,
  inquiryId: row.inquiry_id,
  from:      row.sender_role,       // 'customer' | 'admin'
  fromName:  row.sender_name,
  message:   row.message,
  timestamp: row.sent_at,
});

// ── POST /api/contact ─────────────────────────────────────────────────────────
// Public — no auth required. Saves inquiry to DB.
const submitInquiry = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ message: 'Name, email and message are required.' });

  try {
    const [result] = await db.execute(
      `INSERT INTO contact_inquiry (sender_name, sender_email, sender_phone, subject, message, status)
       VALUES (?, ?, ?, ?, ?, 'new')`,
      [name, email, phone || null, subject || null, message]
    );
    res.status(201).json({ message: 'Inquiry submitted successfully.', inquiryId: result.insertId });
  } catch (err) {
    console.error('submitInquiry error:', err);
    res.status(500).json({ message: 'Failed to submit inquiry.' });
  }
};

// ── GET /api/contact  (admin) ─────────────────────────────────────────────────
const getAllInquiries = async (req, res) => {
  try {
    const [inquiries] = await db.execute(
      `SELECT * FROM contact_inquiry ORDER BY submitted_at DESC`
    );
    if (inquiries.length === 0) return res.json({ inquiries: [] });

    const ids = inquiries.map(i => i.inquiry_id);
    const [replies] = await db.execute(
      `SELECT * FROM contact_reply WHERE inquiry_id IN (${ids.join(',')}) ORDER BY sent_at ASC`
    );

    const repliesByInquiry = replies.reduce((acc, r) => {
      if (!acc[r.inquiry_id]) acc[r.inquiry_id] = [];
      acc[r.inquiry_id].push(mapReply(r));
      return acc;
    }, {});

    const result = inquiries.map(i => ({
      ...mapInquiry(i),
      replies: repliesByInquiry[i.inquiry_id] || [],
    }));

    res.json({ inquiries: result });
  } catch (err) {
    console.error('getAllInquiries error:', err);
    res.status(500).json({ message: 'Failed to load inquiries.' });
  }
};

// ── GET /api/contact/my  (customer) ──────────────────────────────────────────
// Returns only inquiries submitted by the logged-in user's email
const getMyInquiries = async (req, res) => {
  const email = req.user?.email;
  if (!email) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const [inquiries] = await db.execute(
      `SELECT * FROM contact_inquiry WHERE LOWER(sender_email) = LOWER(?) ORDER BY submitted_at DESC`,
      [email]
    );
    if (inquiries.length === 0) return res.json({ inquiries: [] });

    const ids = inquiries.map(i => i.inquiry_id);
    const [replies] = await db.execute(
      `SELECT * FROM contact_reply WHERE inquiry_id IN (${ids.join(',')}) ORDER BY sent_at ASC`
    );
    const repliesByInquiry = replies.reduce((acc, r) => {
      if (!acc[r.inquiry_id]) acc[r.inquiry_id] = [];
      acc[r.inquiry_id].push(mapReply(r));
      return acc;
    }, {});

    res.json({
      inquiries: inquiries.map(i => ({
        ...mapInquiry(i),
        replies: repliesByInquiry[i.inquiry_id] || [],
      })),
    });
  } catch (err) {
    console.error('getMyInquiries error:', err);
    res.status(500).json({ message: 'Failed to load your inquiries.' });
  }
};

// ── POST /api/contact/:id/reply  (admin or customer) ─────────────────────────
const addReply = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'STAFF'].includes(req.user?.role);
  const senderRole = isAdmin ? 'admin' : 'customer';
  const senderName = req.user?.name || (isAdmin ? 'Ceylon Best Tours' : 'Customer');

  if (!message?.trim())
    return res.status(400).json({ message: 'Reply message is required.' });

  try {
    // Insert reply
    const [result] = await db.execute(
      `INSERT INTO contact_reply (inquiry_id, sender_role, sender_name, message) VALUES (?, ?, ?, ?)`,
      [id, senderRole, senderName, message.trim()]
    );

    // Update inquiry status
    const newStatus = isAdmin ? 'replied' : 'new';
    await db.execute(
      `UPDATE contact_inquiry SET status = ?, is_read = ? WHERE inquiry_id = ?`,
      [newStatus, isAdmin ? true : false, id]
    );

    res.status(201).json({
      message: 'Reply sent.',
      reply: {
        id:        result.insertId,
        inquiryId: Number(id),
        from:      senderRole,
        fromName:  senderName,
        message:   message.trim(),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('addReply error:', err);
    res.status(500).json({ message: 'Failed to send reply.' });
  }
};

// ── PATCH /api/contact/:id/read  (admin) ─────────────────────────────────────
const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute(
      `UPDATE contact_inquiry SET is_read = true, status = IF(status = 'new', 'read', status) WHERE inquiry_id = ?`,
      [id]
    );
    res.json({ message: 'Marked as read.' });
  } catch (err) {
    console.error('markAsRead error:', err);
    res.status(500).json({ message: 'Failed to mark as read.' });
  }
};

module.exports = { submitInquiry, getAllInquiries, getMyInquiries, addReply, markAsRead };
