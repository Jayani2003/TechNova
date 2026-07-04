import { useState, useRef, useEffect, useContext } from "react";
import {
  Phone,
  FileText,
  ChevronDown,
  Globe,
  AlertCircle,
  UserPlus,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { api } from "../../../../../config/api";
import { AuthContext } from "../../../../../context/AuthContext";

const PLATFORMS = [
  { id: "mobile",    label: "Mobile",    placeholder: "e.g. +94771234567",          hint: "Mobile number with country code",             numeric: true  },
  { id: "whatsapp",  label: "WhatsApp",  placeholder: "e.g. +94771234567",          hint: "WhatsApp number with country code",           numeric: true  },
  { id: "telegram",  label: "Telegram",  placeholder: "e.g. @yourusername",         hint: "Your Telegram username starting with @",      numeric: false },
  { id: "wechat",    label: "WeChat",    placeholder: "e.g. WeChat ID",             hint: "Your WeChat ID or phone number",              numeric: false },
  { id: "line",      label: "LINE",      placeholder: "e.g. LINE ID",               hint: "Your LINE ID",                                numeric: false },
  { id: "kakao",     label: "KakaoTalk", placeholder: "e.g. KakaoTalk ID",          hint: "Your KakaoTalk ID",                           numeric: false },
  { id: "viber",     label: "Viber",     placeholder: "e.g. +94771234567",          hint: "Viber number with country code",              numeric: true  },
  { id: "signal",    label: "Signal",    placeholder: "e.g. +44701234567",          hint: "Signal number with country code",             numeric: true  },
  { id: "messenger", label: "Messenger", placeholder: "e.g. facebook.com/yourname", hint: "Your Facebook profile URL or username",       numeric: false },
  { id: "imessage",  label: "iMessage",  placeholder: "e.g. +1234567890",           hint: "Apple ID email or phone number",              numeric: false },
  { id: "other",     label: "Other",     placeholder: "e.g. platform + handle",     hint: "Specify your platform and contact handle",    numeric: false },
];

const EMERGENCY_RELATIONSHIPS = [
  "Spouse", "Parent", "Sibling", "Child", "Friend",
  "Colleague", "Hotel Concierge", "Tour Guide", "Other",
];

const inputClass = "w-full px-4 py-3 bg-white border border-[#F5820D]/15 rounded-xl text-[#2C2F3A] text-sm outline-none transition-all focus:border-[#F5820D] focus:ring-2 focus:ring-[#F5820D]/20";

// Validate based on platform type
const validateContact = (value, platform) => {
  if (!value.trim()) return "This field is required.";
  const p = PLATFORMS.find(p => p.id === platform);
  if (p?.numeric) {
    // Allow + at start, then only digits, spaces, dashes
    const cleaned = value.replace(/[\s\-]/g, "");
    if (!/^\+?\d+$/.test(cleaned)) return "Only numbers allowed — no letters or special characters.";
    if (cleaned.replace("+", "").length < 7) return "Number too short — include country code e.g. +94771234567.";
  }
  if (value.trim().length < 3) return "Too short.";
  return "";
};

// Validate emergency phone — always numeric
const validatePhone = (value) => {
  if (!value.trim()) return "This field is required.";
  const cleaned = value.replace(/[\s\-]/g, "");
  if (!/^\+?\d+$/.test(cleaned)) return "Only numbers allowed — no letters or special characters.";
  if (cleaned.replace("+", "").length < 7) return "Too short — include country code e.g. +94771234567.";
  return "";
};

// ── Single platform row ───────────────────────────────────────────────────────
const PlatformRow = ({ index, platform, number, onChange, onRemove, required, usedPlatforms }) => {
  const [touched, setTouched] = useState(false);
  const selected = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];
  const error    = touched ? validateContact(number, platform) : "";
  const isValid  = !validateContact(number, platform) && number.trim().length > 0;
  const available = PLATFORMS.filter(p => !usedPlatforms.includes(p.id) || p.id === platform);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[#2C2F3A]">
          {index === 0
            ? <>{`Primary Contact `}<span className="text-red-500">*</span></>
            : "Alternative Contact"}
          <span className="ml-2 text-[10px] font-normal text-[#6B7280]">
            {index === 0 ? "Required" : "Optional"}
          </span>
        </label>
        {index === 1 && (
          <button type="button" onClick={onRemove}
            className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-red-500 transition-colors">
            <X className="w-3.5 h-3.5" /> Remove
          </button>
        )}
      </div>

      <div className="flex gap-2">
        {/* Platform dropdown — text only, no emojis */}
        <div className="relative flex-shrink-0">
          <select
            value={platform}
            onChange={e => onChange("platform", e.target.value)}
            className="appearance-none pl-3 pr-7 py-3 bg-white border border-[#F5820D]/15 rounded-xl text-[#2C2F3A] text-sm font-medium outline-none focus:border-[#F5820D] focus:ring-2 focus:ring-[#F5820D]/20 cursor-pointer min-w-[130px]"
          >
            {available.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]/70 pointer-events-none" />
        </div>

        {/* Handle / number input */}
        <div className="relative flex-1">
          <input
            type={selected.numeric ? "tel" : "text"}
            value={number}
            onChange={e => onChange("number", e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder={selected.placeholder}
            className={`${inputClass} pr-9 ${
              error    ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
              : isValid ? "border-green-400 focus:ring-green-400/20 focus:border-green-400"
              : ""
            }`}
          />
          {isValid && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
          )}
        </div>
      </div>

      {error
        ? <p className="text-xs text-red-500 flex items-center gap-1 ml-1"><AlertCircle className="w-3 h-3" />{error}</p>
        : <p className="text-xs text-[#6B7280]/70 ml-1">{selected.hint}</p>
      }
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const BookingNotesStep = ({ data, onChange }) => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [showSecond, setShowSecond] = useState(!!(data.contactPlatform2 && data.contactNumber2));
  const [emergencyPhoneTouched, setEmergencyPhoneTouched] = useState(false);

  const nameValue = data.customerName || user?.name || "";
  const emergencyPhoneError = emergencyPhoneTouched ? validatePhone(data.emergencyPhone || "") : "";

  const handlePlatform1 = (field, val) => {
    if (field === "platform") onChange("contactPlatform", val);
    if (field === "number")   onChange("contactNumber",   val);
  };

  const handlePlatform2 = (field, val) => {
    if (field === "platform") onChange("contactPlatform2", val);
    if (field === "number")   onChange("contactNumber2",   val);
  };

  const addSecond = () => {
    const first = data.contactPlatform || "mobile";
    const next  = PLATFORMS.find(p => p.id !== first)?.id || "whatsapp";
    onChange("contactPlatform2", next);
    onChange("contactNumber2", "");
    setShowSecond(true);
  };

  const removeSecond = () => {
    onChange("contactPlatform2", "");
    onChange("contactNumber2", "");
    setShowSecond(false);
  };

  const usedPlatforms = [
    data.contactPlatform || "mobile",
    showSecond ? (data.contactPlatform2 || "whatsapp") : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
<<<<<<< HEAD
      
=======

      {/* ── Contact Details ── */}
>>>>>>> origin/dev
      <div>
        <h3 className="text-lg font-bold text-[#2C2F3A] mb-1 flex items-center gap-2">
          <Phone className="w-5 h-5 text-[#F5820D]" /> {t("bookingForm.notesStep.contactDetails")}
        </h3>
        <p className="text-sm text-[#6B7280] mb-4">
          Choose how you prefer us to reach you about this booking.
        </p>
<<<<<<< HEAD
 
        <div className="space-y-4">
          
=======

        <div className="space-y-5">

          {/* Full Name */}
>>>>>>> origin/dev
          <div>
            <label className="block text-sm font-semibold text-[#2C2F3A] mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nameValue}
              onChange={e => onChange("customerName", e.target.value)}
              placeholder={t("bookingForm.notesStep.fullNamePlaceholder")}
              className={inputClass}
            />
            {user?.name && (
              <p className="text-xs text-[#F5820D] mt-1 ml-1">
                ✓ Auto-filled from your profile — you can edit this
              </p>
            )}
          </div>

          {/* Primary platform */}
          <PlatformRow
            index={0}
            platform={data.contactPlatform || "mobile"}
            number={data.contactNumber || ""}
            onChange={handlePlatform1}
            required
            usedPlatforms={usedPlatforms}
          />

          {/* Second platform or add button */}
          {showSecond ? (
            <PlatformRow
              index={1}
              platform={data.contactPlatform2 || "whatsapp"}
              number={data.contactNumber2 || ""}
              onChange={handlePlatform2}
              onRemove={removeSecond}
              required={false}
              usedPlatforms={usedPlatforms}
            />
          ) : (
            <button
              type="button"
              onClick={addSecond}
              className="flex items-center gap-2 text-sm text-[#F5820D] font-semibold hover:text-[#C85A00] transition-colors"
            >
              <div className="w-7 h-7 rounded-full border-2 border-dashed border-[#F5820D]/40 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5" />
              </div>
              Add alternative contact method
            </button>
          )}

        </div>
      </div>

      {/* ── Emergency Contact ── */}
      <div>
        <h3 className="text-lg font-bold text-[#2C2F3A] mb-1 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#F5820D]" /> {t("bookingForm.notesStep.emergencyContact")}
        </h3>
        <p className="text-sm text-[#6B7280] mb-4">
          In case of emergency during the trip. Saved to your profile.
        </p>
        <div className="bg-white border border-[#F5820D]/15 rounded-2xl p-4 space-y-4">

          <div>
            <label className="block text-sm font-semibold text-[#2C2F3A] mb-1">Name *</label>
            <input
              type="text"
              value={data.emergencyName || ""}
              onChange={e => onChange("emergencyName", e.target.value)}
              placeholder={t("bookingForm.notesStep.emergencyNamePlaceholder")}
              className={inputClass}
            />
          </div>
<<<<<<< HEAD
 
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Phone Number *
            </label>
            <div className="flex gap-2">
              
              <div className="relative">
                <select
                  value={getCountryCode()}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] focus:ring-2 focus:ring-[#00b0a5]/20 cursor-pointer min-w-[110px]"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.country} {c.code}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
 
          
=======

          <div>
            <label className="block text-sm font-semibold text-[#2C2F3A] mb-1">Relationship *</label>
            <div className="relative">
              <select
                value={data.emergencyRelationship || ""}
                onChange={e => onChange("emergencyRelationship", e.target.value)}
                className={`${inputClass} appearance-none pr-8`}
              >
                <option value="" disabled>Select relationship</option>
                {EMERGENCY_RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]/70 pointer-events-none" />
            </div>
          </div>

          {/* Emergency phone — numeric validation */}
          <div>
            <label className="block text-sm font-semibold text-[#2C2F3A] mb-1">Phone Number *</label>
            <div className="relative">
>>>>>>> origin/dev
              <input
                type="tel"
                value={data.emergencyPhone || ""}
                onChange={e => onChange("emergencyPhone", e.target.value)}
                onBlur={() => setEmergencyPhoneTouched(true)}
                placeholder="e.g. +94771234567"
                className={`${inputClass} ${
                  emergencyPhoneError
                    ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                    : data.emergencyPhone && !emergencyPhoneError
                      ? "border-green-400 focus:ring-green-400/20 focus:border-green-400"
                      : ""
                }`}
              />
              {data.emergencyPhone && !emergencyPhoneError && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>
            {emergencyPhoneError
              ? <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{emergencyPhoneError}</p>
              : <p className="text-xs text-[#6B7280]/70 mt-1.5">Include country code e.g. +94771234567</p>
            }
          </div>

        </div>
      </div>
<<<<<<< HEAD
 
      
=======

      {/* ── Additional Notes ── */}
>>>>>>> origin/dev
      <div>
        <h3 className="text-lg font-bold text-[#2C2F3A] mb-1 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#F5820D]" /> {t("bookingForm.notesStep.additionalNotes")}
        </h3>
        <p className="text-sm text-[#6B7280] mb-4">
          {t("bookingForm.notesStep.notesDesc")}
        </p>
        <textarea
          value={data.notes || ""}
          onChange={e => onChange("notes", e.target.value)}
          placeholder={t("bookingForm.notesStep.notesPlaceholder")}
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

<<<<<<< HEAD
      
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <p className="text-sm font-bold text-slate-700 mb-3">✅ Included with every booking:</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Free Wi-Fi in vehicle",
            "Parking & Highway Tolls",
            "Water Bottles",
            "GPS Tracking",
            "Experienced Driver",
            "All Fuel Costs",
            "Foreign Passenger Insurance",
            "Driver Accommodation",
          ].map((service) => (
            <div key={service} className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00b0a5] flex-shrink-0" />
              {service}
            </div>
          ))}
        </div>
      </div>
=======
>>>>>>> origin/dev
    </div>
  );
};

export default BookingNotesStep;