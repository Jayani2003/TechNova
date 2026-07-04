const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Using development fallback secret.');
}

const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
 
// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  try {
    const [rows] = await db.execute(
      'SELECT * FROM user WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];
 
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password.' });
 
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password.' });

    const payload = {
      id:    user.user_id,
      email: user.email,
      name:  user.name,
      role:  user.role,
      contact_number: user.contact_number,
      street_address: user.street_address,
      country: user.country,
      zipcode: user.zipcode,
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
      'INSERT INTO user (name, email, password_hash, country, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, country, 'CUSTOMER']);
 
    const payload = { 
      id: result.insertId, 
      email, 
      name, 
      role: 'CUSTOMER',
      country,
      contact_number: null,
      street_address: null,
      zipcode: null
    };
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
 
// ── PUT /api/auth/password ──────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // From verifyToken middleware

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required.' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM user WHERE user_id = ? LIMIT 1', [userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await db.execute('UPDATE user SET password_hash = ? WHERE user_id = ?', [hash, userId]);

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('changePassword error:', err);
    res.status(500).json({ message: 'Failed to change password.' });
  }
};
 
// ── PUT /api/auth/profile ─────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, contactNumber, address, country, zipcode } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  try {
    await db.execute(
      `UPDATE user 
       SET name = ?, contact_number = ?, street_address = ?, country = ?, zipcode = ? 
       WHERE user_id = ?`,
      [name, contactNumber || null, address || null, country || null, zipcode || null, userId]
    );

    res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};

// ── POST /api/auth/google ────────────────────────────────────────────────────
const googleAuth = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: 'Missing credential.' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    // 1. Check if user exists by provider_id
    let [rows] = await db.execute('SELECT * FROM user WHERE provider_id = ? LIMIT 1', [sub]);
    let user = rows[0];

    // 2. If not found by provider_id, check if they exist by email (to link local and Google account)
    if (!user && email) {
      const [emailRows] = await db.execute('SELECT * FROM user WHERE email = ? LIMIT 1', [email]);
      if (emailRows.length > 0) {
        user = emailRows[0];
        // Link Google provider_id to the existing local account
        await db.execute('UPDATE user SET provider_id = ?, auth_provider = "GOOGLE" WHERE user_id = ?', [sub, user.user_id]);
        
        // Fetch updated user record
        const [updatedRows] = await db.execute('SELECT * FROM user WHERE user_id = ? LIMIT 1', [user.user_id]);
        user = updatedRows[0];
      }
    }

    // 3. If still not found, auto-provision (register) the user
    if (!user) {
      const [result] = await db.execute(
        'INSERT INTO user (name, email, auth_provider, provider_id, role) VALUES (?, ?, "GOOGLE", ?, "CUSTOMER")',
        [name, email, sub]
      );
      
      const [newRows] = await db.execute('SELECT * FROM user WHERE user_id = ? LIMIT 1', [result.insertId]);
      user = newRows[0];
    }

    const tokenPayload = {
      id:    user.user_id,
      email: user.email,
      name:  user.name,
      role:  user.role,
      contact_number: user.contact_number,
      street_address: user.street_address,
      country: user.country,
      zipcode: user.zipcode,
    };

    const token = signToken(tokenPayload);
    res.json({ token, user: tokenPayload });

  } catch (err) {
    console.error('googleAuth error:', err);
    res.status(401).json({ message: 'Invalid Google token.' });
  }
};

module.exports = { login, register, getMe, changePassword, updateProfile, googleAuth };