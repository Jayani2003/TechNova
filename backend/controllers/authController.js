const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
<<<<<<< HEAD

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password, role = 'customer' } = req.body;

=======
 
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Using development fallback secret.');
}

const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
 
// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;
 
>>>>>>> origin/dev
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  try {
<<<<<<< HEAD
    let user, idField;

    if (role === 'admin') {
      const [rows] = await db.execute(
        'SELECT * FROM admin WHERE email = ? LIMIT 1', [email]);
      user = rows[0];
      idField = 'admin_id';
    } else {
      const [rows] = await db.execute(
        'SELECT * FROM customer WHERE email = ? LIMIT 1', [email]);
      user = rows[0];
      idField = 'customer_id';
    }

    if (!user)
      return res.status(401).json({ message: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
=======
    const [rows] = await db.execute(
      'SELECT * FROM user WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];
 
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password.' });
 
    const match = await bcrypt.compare(password, user.password_hash);
>>>>>>> origin/dev
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password.' });

    const payload = {
      id:    user.user_id,
      email: user.email,
      name:  user.name,
      role:  user.role,
    };

    const token = signToken(payload);
    res.json({ token, user: payload });

  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Login failed.' });
  }
};

// ── POST /api/auth/register ───────────────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, password, country = 'Sri Lanka' } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email and password are required.' });

  try {
    const [existing] = await db.execute(
      'SELECT user_id FROM user WHERE email = ? LIMIT 1', [email]);
    if (existing.length)
      return res.status(409).json({ message: 'An account with this email already exists.' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
<<<<<<< HEAD
      'INSERT INTO customer (name, email, password, country) VALUES (?, ?, ?, ?)',
      [name, email, hash, country]);

=======
      'INSERT INTO user (name, email, password_hash, country, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, country, 'CUSTOMER']);
 
>>>>>>> origin/dev
    const payload = { id: result.insertId, email, name, role: 'CUSTOMER' };
    const token = signToken(payload);
    res.status(201).json({ token, user: payload });

  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'Registration failed.' });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
// Used on app load to validate a stored token and refresh user info
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { login, register, getMe };
