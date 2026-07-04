// ─── OTP Controller — dual gateway ────────────────────────────────────────────
// +94 (Sri Lanka) numbers  →  notify.lk  (free, no restrictions)
// All other numbers         →  Twilio     (paid, international)
//
// Required .env variables:
//
//   notify.lk (register free at https://app.notify.lk):
//   NOTIFYLK_USER_ID=your_user_id
//   NOTIFYLK_API_KEY=your_api_key
//   NOTIFYLK_SENDER_ID=CeylonTours   ← your approved sender name
//
//   Twilio (for international numbers — needs paid account):
//   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//   TWILIO_AUTH_TOKEN=your_auth_token
//   TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
// ──────────────────────────────────────────────────────────────────────────────

const axios  = require('axios');
const twilio = require('twilio');

// ── Twilio lazy-init ──────────────────────────────────────────────────────────
let twilioClient = null;
const getTwilioClient = () => {
  if (twilioClient) return twilioClient;
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token)
    throw new Error('Twilio credentials missing. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env');
  twilioClient = twilio(sid, token);
  return twilioClient;
};

// ── OTP store ─────────────────────────────────────────────────────────────────
const otpStore = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS  = 5;
const RESEND_WAIT   = 60 * 1000;

const generateOtp = () =>
  String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');

// Remove spaces/dashes — "+94 77 123 4567" → "+94771234567"
const toE164 = (raw) => raw.trim().replace(/[\s\-]/g, '');

// notify.lk wants "94771234567" (no +)
const toNotifyLkFormat = (e164) => e164.replace(/^\+/, '');

// Returns true if the number is a Sri Lankan mobile (+94 or 094 or 94...)
const isSriLankan = (e164) => e164.startsWith('+94');

// ── Send via notify.lk ────────────────────────────────────────────────────────
const sendViaNotifyLk = async (e164, otp) => {
  const userId   = process.env.NOTIFYLK_USER_ID;
  const apiKey   = process.env.NOTIFYLK_API_KEY;
  const senderId = process.env.NOTIFYLK_SENDER_ID;

  if (!userId || !apiKey || !senderId)
    throw new Error('notify.lk credentials missing. Set NOTIFYLK_USER_ID, NOTIFYLK_API_KEY, NOTIFYLK_SENDER_ID in .env');

  const message = `Your Ceylon Best Tours verification code is: ${otp}. Valid for 5 minutes. Do not share this with anyone.`;

  const response = await axios.get('https://app.notify.lk/api/v1/send', {
    params: {
      user_id:   userId,
      api_key:   apiKey,
      sender_id: senderId,
      to:        toNotifyLkFormat(e164),
      message,
    },
    timeout: 10000,
  });

  // notify.lk returns { status: "success", data: "Sent" } on success
  if (response.data?.status !== 'success')
    throw new Error(`notify.lk error: ${JSON.stringify(response.data)}`);
};

// ── Send via Twilio ───────────────────────────────────────────────────────────
const sendViaTwilio = async (e164, otp) => {
  const message = `Your Ceylon Best Tours verification code is: ${otp}. Valid for 5 minutes. Do not share this with anyone.`;

  await getTwilioClient().messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to:   e164,
  });
};

// ── POST /api/auth/otp/send ───────────────────────────────────────────────────
const sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone || phone.trim().length < 8)
    return res.status(400).json({ message: 'Valid phone number is required.' });

  const key  = phone.trim();
  const e164 = toE164(phone);

  // Rate-limit
  const existing = otpStore.get(key);
  if (existing && Date.now() - existing.sentAt < RESEND_WAIT) {
    const wait = Math.ceil((RESEND_WAIT - (Date.now() - existing.sentAt)) / 1000);
    return res.status(429).json({ message: `Please wait ${wait}s before requesting another code.` });
  }

  const otp = generateOtp();
  otpStore.set(key, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts:  0,
    sentAt:    Date.now(),
  });

  try {
    if (isSriLankan(e164)) {
      console.log(`[OTP] Sending via notify.lk to ${e164}`);
      await sendViaNotifyLk(e164, otp);
    } else {
      console.log(`[OTP] Sending via Twilio to ${e164}`);
      await sendViaTwilio(e164, otp);
    }

    console.log(`[OTP] Successfully sent to ${e164}`);
    res.json({ message: 'OTP sent successfully.' });

  } catch (err) {
    otpStore.delete(key);

    // Log full error so developer can diagnose from server console
    console.error('[OTP] Send failed:');
    console.error('  message :', err.message);
    console.error('  code    :', err.code);
    console.error('  response:', err.response?.data || 'no response body');
    console.error('  phone   :', e164);
    console.error('  gateway :', isSriLankan(e164) ? 'notify.lk' : 'Twilio');

    // Missing .env credentials
    if (err.message?.includes('credentials missing'))
      return res.status(500).json({ message: err.message });

    // Axios network/timeout error (notify.lk unreachable)
    if (err.code === 'ECONNABORTED')
      return res.status(500).json({ message: 'SMS gateway timed out. Please try again.' });
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED')
      return res.status(500).json({ message: 'SMS gateway unreachable. Check your internet connection.' });

    // notify.lk API-level errors
    if (err.message?.includes('notify.lk error'))
      return res.status(500).json({ message: 'SMS delivery failed. Check your notify.lk credentials and Sender ID.' });

    // Twilio error codes
    const code = err.code;
    if (code === 21211 || code === 21614)
      return res.status(400).json({ message: 'Invalid phone number. Please check and try again.' });
    if (code === 21408)
      return res.status(400).json({ message: 'SMS is not supported for this number or region.' });
    if (code === 20003)
      return res.status(500).json({ message: 'SMS service configuration error. Please contact support.' });

    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// ── POST /api/auth/otp/verify ─────────────────────────────────────────────────
const verifyOtp = (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp)
    return res.status(400).json({ message: 'Phone and OTP are required.' });

  const key    = phone.trim();
  const record = otpStore.get(key);

  if (!record)
    return res.status(400).json({ message: 'No OTP was sent to this number. Please request a new code.' });

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return res.status(400).json({ message: 'OTP has expired. Please request a new code.' });
  }

  record.attempts += 1;

  if (record.attempts > MAX_ATTEMPTS) {
    otpStore.delete(key);
    return res.status(429).json({ message: 'Too many failed attempts. Please request a new code.' });
  }

  if (otp.trim() !== record.otp) {
    const left = MAX_ATTEMPTS - record.attempts;
    return res.status(400).json({
      message: left > 0
        ? `Incorrect code. ${left} attempt${left !== 1 ? 's' : ''} remaining.`
        : 'Too many failed attempts. Please request a new code.',
    });
  }

  otpStore.delete(key);
  res.json({ message: 'Phone number verified successfully.' });
};

module.exports = { sendOtp, verifyOtp };
