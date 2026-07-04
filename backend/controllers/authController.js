const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Using development fallback secret.');
}

const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

// Builds the user payload object from a DB row
const buildUserPayload = (u) => ({
  id:                     u.user_id,
  email:                  u.email,
  name:                   u.name,
  role:                   u.role,
  contact_number:         u.contact_number         || null,
  street_address:         u.street_address         || null,
  country:                u.country                || null,
  zipcode:                u.zipcode                || null,
  emergency_name:         u.emergency_name         || null,
  emergency_phone:        u.emergency_phone        || null,
  emergency_relationship: u.emergency_relationship || null,
});

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

    if (user.status === 'BLOCKED')
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });

    const payload = buildUserPayload(user);
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

    const payload = buildUserPayload({
      user_id: result.insertId,
      email,
      name,
      role: 'CUSTOMER',
      country,
    });
    const token = signToken(payload);
    res.status(201).json({ token, user: payload });

  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'Registration failed.' });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
// Always reads fresh from DB so emergency contact changes reflect immediately
const getMe = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT user_id, name, email, role, contact_number, street_address, country, zipcode,
              emergency_name, emergency_phone, emergency_relationship, status
       FROM user WHERE user_id = ? LIMIT 1`,
      [req.user.id]
    );

    if (!rows.length)
      return res.status(404).json({ message: 'User not found.' });

    const u = rows[0];
    if (u.status === 'BLOCKED')
      return res.status(403).json({ message: 'Account blocked.' });

    res.json({ user: buildUserPayload(u) });
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ message: 'Failed to load user.' });
  }
};

// ── PUT /api/auth/password ────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: 'Current and new password are required.' });

  try {
    const [rows] = await db.execute('SELECT * FROM user WHERE user_id = ? LIMIT 1', [userId]);
    const user = rows[0];

    if (!user)
      return res.status(404).json({ message: 'User not found.' });

    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match)
      return res.status(401).json({ message: 'Incorrect current password.' });

    const hash = await bcrypt.hash(newPassword, 10);
    await db.execute('UPDATE user SET password_hash = ? WHERE user_id = ?', [hash, userId]);

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('changePassword error:', err);
    res.status(500).json({ message: 'Failed to change password.' });
  }
};

// ── PUT /api/auth/profile ─────────────────────────────────────────────────────
// Saves both regular profile fields AND emergency contact fields (now on user table)
const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    name,
    contactNumber,
    address,
    country,
    zipcode,
    emergencyName,
    emergencyPhone,
    emergencyRelationship,
  } = req.body;

  if (!name)
    return res.status(400).json({ message: 'Name is required.' });

  try {
    await db.execute(
      `UPDATE user
       SET name = ?, contact_number = ?, street_address = ?, country = ?, zipcode = ?,
           emergency_name = ?, emergency_phone = ?, emergency_relationship = ?
       WHERE user_id = ?`,
      [
        name,
        contactNumber         || null,
        address               || null,
        country               || null,
        zipcode               || null,
        emergencyName         || null,
        emergencyPhone        || null,
        emergencyRelationship || null,
        userId,
      ]
    );

    // Return fresh user so frontend state is always consistent
    const [rows] = await db.execute(
      `SELECT user_id, name, email, role, contact_number, street_address, country, zipcode,
              emergency_name, emergency_phone, emergency_relationship
       FROM user WHERE user_id = ? LIMIT 1`,
      [userId]
    );

    res.json({ message: 'Profile updated successfully.', user: buildUserPayload(rows[0]) });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};

// ── POST /api/auth/google ─────────────────────────────────────────────────────
const googleAuth = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Authorization code is required.' });
  }

  try {
    const { tokens } = await googleClient.getToken(code);
    const idToken = tokens.id_token;
    
    if (!idToken) {
      return res.status(400).json({ message: 'No ID token found from Google.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub, picture } = payload; // sub is Google's unique user ID

    // Check if user exists
    const [rows] = await db.execute('SELECT * FROM user WHERE email = ? LIMIT 1', [email]);
    let user = rows[0];

    if (user) {
      // User exists. Update auth_provider to GOOGLE if it was local, or just allow login
      if (user.status === 'BLOCKED') {
        return res.status(403).json({ message: 'Your account has been blocked.' });
      }
      
      // Optionally update provider_id if missing
      if (!user.provider_id) {
         await db.execute('UPDATE user SET auth_provider = ?, provider_id = ? WHERE user_id = ?', 
           ['GOOGLE', sub, user.user_id]);
      }
    } else {
      // Create new user
      const [result] = await db.execute(
        'INSERT INTO user (name, email, role, auth_provider, provider_id) VALUES (?, ?, ?, ?, ?)',
        [name, email, 'CUSTOMER', 'GOOGLE', sub]
      );
      
      const [newRows] = await db.execute('SELECT * FROM user WHERE user_id = ?', [result.insertId]);
      user = newRows[0];
    }

    const userPayload = buildUserPayload(user);
    const token = signToken(userPayload);

    res.status(200).json({ token, user: userPayload });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ message: 'Google authentication failed: ' + (err.message || JSON.stringify(err)) });
  }
};

module.exports = { login, register, getMe, changePassword, updateProfile, googleAuth };
