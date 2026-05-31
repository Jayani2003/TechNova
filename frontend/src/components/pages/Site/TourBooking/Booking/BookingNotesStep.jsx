import { useState, useRef, useEffect } from "react";
import { Phone, FileText, ChevronDown, Globe, AlertCircle, UserPlus, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { api } from "../../../../../config/api";

const COUNTRIES = [
  { code: "+94",  flag: "🇱🇰", name: "Sri Lanka",    minLen: 9,  maxLen: 9  },
  { code: "+1",   flag: "🇺🇸", name: "USA/Canada",   minLen: 10, maxLen: 10 },
  { code: "+44",  flag: "🇬🇧", name: "UK",           minLen: 10, maxLen: 10 },
  { code: "+61",  flag: "🇦🇺", name: "Australia",    minLen: 9,  maxLen: 9  },
  { code: "+49",  flag: "🇩🇪", name: "Germany",      minLen: 10, maxLen: 11 },
  { code: "+33",  flag: "🇫🇷", name: "France",       minLen: 9,  maxLen: 9  },
  { code: "+81",  flag: "🇯🇵", name: "Japan",        minLen: 10, maxLen: 10 },
  { code: "+86",  flag: "🇨🇳", name: "China",        minLen: 11, maxLen: 11 },
  { code: "+91",  flag: "🇮🇳", name: "India",        minLen: 10, maxLen: 10 },
  { code: "+65",  flag: "🇸🇬", name: "Singapore",    minLen: 8,  maxLen: 8  },
  { code: "+60",  flag: "🇲🇾", name: "Malaysia",     minLen: 9,  maxLen: 10 },
  { code: "+971", flag: "🇦🇪", name: "UAE",          minLen: 9,  maxLen: 9  },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia", minLen: 9,  maxLen: 9  },
  { code: "+82",  flag: "🇰🇷", name: "South Korea",  minLen: 9,  maxLen: 10 },
  { code: "+39",  flag: "🇮🇹", name: "Italy",        minLen: 9,  maxLen: 10 },
  { code: "+34",  flag: "🇪🇸", name: "Spain",        minLen: 9,  maxLen: 9  },
  { code: "+31",  flag: "🇳🇱", name: "Netherlands",  minLen: 9,  maxLen: 9  },
  { code: "+46",  flag: "🇸🇪", name: "Sweden",       minLen: 9,  maxLen: 9  },
  { code: "+47",  flag: "🇳🇴", name: "Norway",       minLen: 8,  maxLen: 8  },
  { code: "+41",  flag: "🇨🇭", name: "Switzerland",  minLen: 9,  maxLen: 9  },
  { code: "+64",  flag: "🇳🇿", name: "New Zealand",  minLen: 8,  maxLen: 10 },
  { code: "+55",  flag: "🇧🇷", name: "Brazil",       minLen: 10, maxLen: 11 },
  { code: "+62",  flag: "🇮🇩", name: "Indonesia",    minLen: 9,  maxLen: 12 },
  { code: "+66",  flag: "🇹🇭", name: "Thailand",     minLen: 9,  maxLen: 9  },
  { code: "+84",  flag: "🇻🇳", name: "Vietnam",      minLen: 9,  maxLen: 10 },
  { code: "+92",  flag: "🇵🇰", name: "Pakistan",     minLen: 10, maxLen: 10 },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh",   minLen: 10, maxLen: 10 },
  { code: "+27",  flag: "🇿🇦", name: "South Africa", minLen: 9,  maxLen: 9  },
  { code: "+7",   flag: "🇷🇺", name: "Russia",       minLen: 10, maxLen: 10 },
  { code: "+20",  flag: "🇪🇬", name: "Egypt",        minLen: 10, maxLen: 10 },
  { code: "+48",  flag: "🇵🇱", name: "Poland",       minLen: 9,  maxLen: 9  },
];

const EMERGENCY_RELATIONSHIPS = [
  "Spouse", "Parent", "Sibling", "Child", "Friend",
  "Colleague", "Hotel Concierge", "Tour Guide", "Other",
];

const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all focus:border-[#F5820D] focus:ring-2 focus:ring-[#F5820D]/20";

const validatePhone = (digits, code) => {
  if (!digits) return "Phone number is required.";
  if (!/^\d+$/.test(digits)) return "Only digits allowed — no spaces or dashes.";
  const country = COUNTRIES.find(c => c.code === code);
  if (!country) return digits.length < 7 ? "Too short." : digits.length > 15 ? "Too long." : "";
  if (digits.length < country.minLen) return `Too short for ${country.name} — need ${country.minLen} digits (entered ${digits.length}).`;
  if (digits.length > country.maxLen) return `Too long for ${country.name} — max ${country.maxLen} digits.`;
  return "";
};

// ─── OTP-verified Phone Input ──────────────────────────────────────────────────
// OTP flow:
//  1. User enters number → validates length/format
//  2. Clicks "Send OTP" → POST /api/auth/otp/send  { phone: "+94 771234567" }
//  3. Six individual digit boxes appear
//  4. User types/pastes OTP → POST /api/auth/otp/verify { phone, otp }
//  5. On success: field is locked, green "Verified" badge shown
//  6. "Change number" resets the flow
const OtpPhoneInput = ({ value, onChange, onVerified, verified }) => {
  // Phone sub-state
  const [touched,    setTouched]    = useState(false);
  const [countryCode, setCountryCode] = useState("+94");
  const [digits,      setDigits]    = useState(() => {
    if (!value) return "";
    const match = COUNTRIES.find(c => value.startsWith(c.code + " "));
    return match ? value.slice(match.code.length + 1) : value;
  });

  // OTP sub-state
  const [otpSent,    setOtpSent]    = useState(false);
  const [otp,        setOtp]        = useState(["", "", "", "", "", ""]);
  const [sending,    setSending]    = useState(false);
  const [verifying,  setVerifying]  = useState(false);
  const [sendError,  setSendError]  = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [cooldown,   setCooldown]   = useState(0);

  const otpRefs = useRef([]);

  // Cooldown countdown (60 s between resend attempts)
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const country      = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];
  const phoneError   = touched ? validatePhone(digits.replace(/\s/g, ""), countryCode) : "";
  const phoneValid   = !validatePhone(digits.replace(/\s/g, ""), countryCode) && digits.length > 0;
  const fullPhone    = `${countryCode} ${digits}`;

  const handleCountryChange = (code) => {
    setCountryCode(code);
    onChange(`${code} ${digits}`);
    onVerified(false);
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleDigits = (val) => {
    const cleaned = val.replace(/[^\d\s]/g, "");
    setDigits(cleaned);
    onChange(`${countryCode} ${cleaned}`);
    onVerified(false);
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
  };

  const sendOtp = async () => {
    setSending(true);
    setSendError("");
    try {
      await api.post("/auth/otp/send", { phone: fullPhone });
      setOtpSent(true);
      setCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setSendError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleOtpDigit = (idx, val) => {
    // Accept paste of full code
    if (val.length > 1) {
      const pasted = val.replace(/\D/g, "").slice(0, 6).split("");
      const next = [...otp];
      pasted.forEach((d, i) => { if (i < 6) next[i] = d; });
      setOtp(next);
      otpRefs.current[Math.min(pasted.length, 5)]?.focus();
      return;
    }
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    setVerifying(true);
    setVerifyError("");
    try {
      await api.post("/auth/otp/verify", { phone: fullPhone, otp: otp.join("") });
      onVerified(true);
    } catch (err) {
      setVerifyError(err.message || "Incorrect code. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const reset = () => {
    onVerified(false);
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
    setVerifyError("");
    setSendError("");
  };

  const otpComplete = otp.every(d => d !== "");

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        Phone Number <span className="text-red-500">*</span>
      </label>

      {/* Phone row */}
      <div className="flex gap-2">
        <div className="relative">
          <select
            value={countryCode}
            onChange={e => handleCountryChange(e.target.value)}
            disabled={verified}
            className="appearance-none pl-3 pr-7 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-[#F5820D] focus:ring-2 focus:ring-[#F5820D]/20 cursor-pointer min-w-[160px] disabled:opacity-60"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.code})</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <input
          type="tel"
          value={digits}
          onChange={e => handleDigits(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={`${country.minLen} digits`}
          disabled={verified}
          className={`${inputClass} flex-1 disabled:opacity-60 disabled:bg-slate-50 ${
            touched && phoneError   ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
          : verified               ? "border-green-400 bg-green-50"
          : touched && phoneValid  ? "border-green-400 focus:ring-green-400/20 focus:border-green-400"
          : ""}`}
        />
      </div>

      {/* Format hint / error */}
      {touched && phoneError
        ? <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{phoneError}</p>
        : <p className="text-xs text-slate-400">{country.name}: {country.minLen === country.maxLen ? `${country.minLen} digits` : `${country.minLen}–${country.maxLen} digits`} required</p>
      }

      {/* ── Verified state ── */}
      {verified && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-semibold">Phone number verified</span>
          </div>
          <button type="button" onClick={reset}
            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 underline underline-offset-2">
            <RefreshCw className="w-3 h-3" /> Change number
          </button>
        </div>
      )}

      {/* ── Send OTP button (shown when valid number, not yet sent/verified) ── */}
      {!verified && !otpSent && phoneValid && (
        <div>
          <button
            type="button"
            onClick={sendOtp}
            disabled={sending || !phoneValid}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F5820D] hover:bg-[#C85A00] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Phone className="w-4 h-4" /> Send OTP</>}
          </button>
          {sendError && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{sendError}</p>}
        </div>
      )}

      {/* ── OTP entry (shown after send) ── */}
      {!verified && otpSent && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <p className="text-sm text-slate-600">
            We sent a 6-digit code to <span className="font-bold text-slate-800">{fullPhone}</span>.
            Enter it below.
          </p>

          {/* Six digit boxes */}
          <div className="flex gap-2 justify-start">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={el => otpRefs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={d}
                onChange={e => handleOtpDigit(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all
                  focus:border-[#F5820D] focus:ring-2 focus:ring-[#F5820D]/20 bg-white
                  ${verifyError ? "border-red-400" : d ? "border-[#F5820D]/40" : "border-slate-200"}`}
              />
            ))}
          </div>

          {verifyError && (
            <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{verifyError}</p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            {/* Verify button */}
            <button
              type="button"
              onClick={verifyOtp}
              disabled={!otpComplete || verifying}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#00b0a5] hover:bg-[#00908a] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {verifying ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : <>Verify Code</>}
            </button>

            {/* Resend */}
            <button
              type="button"
              onClick={sendOtp}
              disabled={cooldown > 0 || sending}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-40"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Plain phone input for emergency contact (no OTP) ─────────────────────────
const PhoneInput = ({ value, onChange, label, required }) => {
  const [touched, setTouched] = useState(false);

  const getCode = () => {
    if (!value) return "+94";
    const match = COUNTRIES.find(c => value.startsWith(c.code + " "));
    return match ? match.code : "+94";
  };
  const getNumber = () => {
    const code = getCode();
    return value && value.startsWith(code + " ") ? value.slice(code.length + 1) : (value || "");
  };

  const country = COUNTRIES.find(c => c.code === getCode()) || COUNTRIES[0];
  const digits  = getNumber().replace(/\s/g, "");
  const error   = touched ? validatePhone(digits, getCode()) : "";
  const isValid = !validatePhone(digits, getCode()) && digits.length > 0;

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {required && "*"}
      </label>
      <div className="flex gap-2">
        <div className="relative">
          <select
            value={getCode()}
            onChange={e => onChange(`${e.target.value} ${getNumber()}`)}
            className="appearance-none pl-3 pr-7 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-[#F5820D] focus:ring-2 focus:ring-[#F5820D]/20 cursor-pointer min-w-[160px]"
          >
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.code})</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <input
          type="tel"
          value={getNumber()}
          onChange={e => onChange(`${getCode()} ${e.target.value.replace(/[^\d\s]/g, "")}`)}
          onBlur={() => setTouched(true)}
          placeholder={`${country.minLen} digits`}
          className={`${inputClass} flex-1 ${
            touched && error   ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
          : touched && isValid ? "border-green-400 focus:ring-green-400/20 focus:border-green-400"
          : ""}`}
        />
      </div>
      {touched && error
        ? <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>
        : touched && isValid
          ? <p className="text-xs text-green-600 mt-1.5">✓ Valid {country.name} number</p>
          : <p className="text-xs text-slate-400 mt-1.5">{country.name}: {country.minLen === country.maxLen ? `${country.minLen} digits` : `${country.minLen}–${country.maxLen} digits`} required</p>
      }
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const BookingNotesStep = ({ data, onChange }) => {
  const [phoneVerified, setPhoneVerified] = useState(false);

  return (
    <div className="space-y-6">

      {/* ── Contact Details ── */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Phone className="w-5 h-5 text-[#F5820D]" /> Contact Details
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          We'll use this to reach you about your booking.
        </p>
        <div className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={data.customerName}
              onChange={e => onChange("customerName", e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
            {data.customerName && (
              <p className="text-xs text-[#F5820D] mt-1">✓ Pre-filled from your account — you can edit this</p>
            )}
          </div>

          {/* Phone with OTP */}
          <OtpPhoneInput
            value={data.customerPhone}
            onChange={val => onChange("customerPhone", val)}
            onVerified={setPhoneVerified}
            verified={phoneVerified}
          />

          {/* Note: OTP verification is for customer's own number only */}
          {!phoneVerified && (
            <div className="flex items-start gap-3 bg-[#F5820D]/5 border border-[#F5820D]/15 rounded-xl px-4 py-3">
              <Globe className="w-4 h-4 text-[#F5820D] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                We verify your phone number via a one-time code to ensure our team can reach you.
                Emergency contact numbers are not verified.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Emergency Contact (no OTP) ── */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#F5820D]" /> Emergency Contact
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          In case of emergency, who should we contact? This is saved to your profile.
        </p>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Emergency Contact Name *</label>
            <input
              type="text"
              value={data.emergencyName || ""}
              onChange={e => onChange("emergencyName", e.target.value)}
              placeholder="Full name of emergency contact"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Relationship *</label>
            <select
              value={data.emergencyRelationship || ""}
              onChange={e => onChange("emergencyRelationship", e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>Select relationship</option>
              {EMERGENCY_RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <PhoneInput
            value={data.emergencyPhone || ""}
            onChange={val => onChange("emergencyPhone", val)}
            label="Emergency Contact Phone"
            required
          />
        </div>
      </div>

      {/* ── Additional Notes ── */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#F5820D]" /> Additional Notes
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Any special requests, preferences, or information for the driver.
        </p>
        <textarea
          value={data.notes}
          onChange={e => onChange("notes", e.target.value)}
          placeholder="E.g. early morning pickup, wheelchair access needed, stop at airport first…"
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>
    </div>
  );
};

export default BookingNotesStep;
