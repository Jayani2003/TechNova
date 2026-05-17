import { useState } from "react";
import { Phone, FileText, ChevronDown, Globe } from "lucide-react";

// ── Country data with phone rules ─────────────────────────────────────────────
const COUNTRIES = [
  { code: "+94",  flag: "🇱🇰", name: "Sri Lanka",      iso: "LK", minLen: 9,  maxLen: 9  },
  { code: "+1",   flag: "🇺🇸", name: "United States",  iso: "US", minLen: 10, maxLen: 10 },
  { code: "+1",   flag: "🇨🇦", name: "Canada",         iso: "CA", minLen: 10, maxLen: 10 },
  { code: "+44",  flag: "🇬🇧", name: "United Kingdom", iso: "GB", minLen: 10, maxLen: 10 },
  { code: "+61",  flag: "🇦🇺", name: "Australia",      iso: "AU", minLen: 9,  maxLen: 9  },
  { code: "+49",  flag: "🇩🇪", name: "Germany",        iso: "DE", minLen: 10, maxLen: 11 },
  { code: "+33",  flag: "🇫🇷", name: "France",         iso: "FR", minLen: 9,  maxLen: 9  },
  { code: "+81",  flag: "🇯🇵", name: "Japan",          iso: "JP", minLen: 10, maxLen: 10 },
  { code: "+86",  flag: "🇨🇳", name: "China",          iso: "CN", minLen: 11, maxLen: 11 },
  { code: "+91",  flag: "🇮🇳", name: "India",          iso: "IN", minLen: 10, maxLen: 10 },
  { code: "+65",  flag: "🇸🇬", name: "Singapore",      iso: "SG", minLen: 8,  maxLen: 8  },
  { code: "+60",  flag: "🇲🇾", name: "Malaysia",       iso: "MY", minLen: 9,  maxLen: 10 },
  { code: "+971", flag: "🇦🇪", name: "UAE",            iso: "AE", minLen: 9,  maxLen: 9  },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia",   iso: "SA", minLen: 9,  maxLen: 9  },
  { code: "+82",  flag: "🇰🇷", name: "South Korea",    iso: "KR", minLen: 9,  maxLen: 10 },
  { code: "+39",  flag: "🇮🇹", name: "Italy",          iso: "IT", minLen: 9,  maxLen: 10 },
  { code: "+34",  flag: "🇪🇸", name: "Spain",          iso: "ES", minLen: 9,  maxLen: 9  },
  { code: "+31",  flag: "🇳🇱", name: "Netherlands",    iso: "NL", minLen: 9,  maxLen: 9  },
  { code: "+46",  flag: "🇸🇪", name: "Sweden",         iso: "SE", minLen: 9,  maxLen: 9  },
  { code: "+47",  flag: "🇳🇴", name: "Norway",         iso: "NO", minLen: 8,  maxLen: 8  },
  { code: "+41",  flag: "🇨🇭", name: "Switzerland",    iso: "CH", minLen: 9,  maxLen: 9  },
  { code: "+43",  flag: "🇦🇹", name: "Austria",        iso: "AT", minLen: 10, maxLen: 11 },
  { code: "+32",  flag: "🇧🇪", name: "Belgium",        iso: "BE", minLen: 9,  maxLen: 9  },
  { code: "+351", flag: "🇵🇹", name: "Portugal",       iso: "PT", minLen: 9,  maxLen: 9  },
  { code: "+45",  flag: "🇩🇰", name: "Denmark",        iso: "DK", minLen: 8,  maxLen: 8  },
  { code: "+358", flag: "🇫🇮", name: "Finland",        iso: "FI", minLen: 9,  maxLen: 10 },
  { code: "+7",   flag: "🇷🇺", name: "Russia",         iso: "RU", minLen: 10, maxLen: 10 },
  { code: "+55",  flag: "🇧🇷", name: "Brazil",         iso: "BR", minLen: 10, maxLen: 11 },
  { code: "+52",  flag: "🇲🇽", name: "Mexico",         iso: "MX", minLen: 10, maxLen: 10 },
  { code: "+27",  flag: "🇿🇦", name: "South Africa",   iso: "ZA", minLen: 9,  maxLen: 9  },
  { code: "+20",  flag: "🇪🇬", name: "Egypt",          iso: "EG", minLen: 10, maxLen: 10 },
  { code: "+62",  flag: "🇮🇩", name: "Indonesia",      iso: "ID", minLen: 9,  maxLen: 12 },
  { code: "+63",  flag: "🇵🇭", name: "Philippines",    iso: "PH", minLen: 10, maxLen: 10 },
  { code: "+66",  flag: "🇹🇭", name: "Thailand",       iso: "TH", minLen: 9,  maxLen: 9  },
  { code: "+84",  flag: "🇻🇳", name: "Vietnam",        iso: "VN", minLen: 9,  maxLen: 10 },
  { code: "+92",  flag: "🇵🇰", name: "Pakistan",       iso: "PK", minLen: 10, maxLen: 10 },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh",     iso: "BD", minLen: 10, maxLen: 10 },
  { code: "+64",  flag: "🇳🇿", name: "New Zealand",    iso: "NZ", minLen: 8,  maxLen: 10 },
  { code: "+353", flag: "🇮🇪", name: "Ireland",        iso: "IE", minLen: 9,  maxLen: 9  },
  { code: "+48",  flag: "🇵🇱", name: "Poland",         iso: "PL", minLen: 9,  maxLen: 9  },
];

const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] focus:ring-2 focus:ring-[#00b0a5]/20";

// ── Per-country validation ────────────────────────────────────────────────────
const validatePhoneNumber = (digits, countryCode) => {
  if (!digits) return "Phone number is required.";
  if (!/^\d+$/.test(digits)) return "Only digits are allowed — no spaces or dashes.";
  const country = COUNTRIES.find(c => c.code === countryCode);
  if (!country) {
    if (digits.length < 7)  return "Too short — enter at least 7 digits.";
    if (digits.length > 15) return "Too long — maximum 15 digits.";
    return "";
  }
  if (digits.length < country.minLen)
    return `Too short for ${country.name} — need ${country.minLen} digits (you entered ${digits.length}).`;
  if (digits.length > country.maxLen)
    return `Too long for ${country.name} — maximum ${country.maxLen} digits (you entered ${digits.length}).`;
  return "";
};

// ── Component ─────────────────────────────────────────────────────────────────
const BookingNotesStep = ({ data, onChange }) => {
  const [phoneError,   setPhoneError]   = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  const getCountryCode = () => {
    if (!data.customerPhone) return "+94";
    const match = COUNTRIES.find(c => data.customerPhone.startsWith(c.code + " "));
    return match ? match.code : "+94";
  };

  const getPhoneNumber = () => {
    if (!data.customerPhone) return "";
    const code = getCountryCode();
    return data.customerPhone.startsWith(code + " ")
      ? data.customerPhone.slice(code.length + 1)
      : data.customerPhone;
  };

  const selectedCountry = COUNTRIES.find(c => c.code === getCountryCode()) || COUNTRIES[0];

  const handleCountryChange = (code) => {
    const num = getPhoneNumber();
    onChange("customerPhone", `${code} ${num}`);
    if (phoneTouched)
      setPhoneError(validatePhoneNumber(num.replace(/\s/g, ""), code));
  };

  const handleNumberChange = (value) => {
    const cleaned = value.replace(/[^\d\s]/g, "");
    onChange("customerPhone", `${getCountryCode()} ${cleaned}`);
    if (phoneTouched)
      setPhoneError(validatePhoneNumber(cleaned.replace(/\s/g, ""), getCountryCode()));
  };

  const handleNumberBlur = () => {
    setPhoneTouched(true);
    const digits = getPhoneNumber().replace(/\s/g, "");
    setPhoneError(validatePhoneNumber(digits, getCountryCode()));
  };

  const isPhoneValid = !validatePhoneNumber(
    getPhoneNumber().replace(/\s/g, ""), getCountryCode()
  );

  return (
    <div className="space-y-6">
      {/* ── Contact Details ── */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Phone className="w-5 h-5 text-[#00b0a5]" /> Contact Details
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          We'll use this to reach you about your booking.
        </p>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={data.customerName}
              onChange={(e) => onChange("customerName", e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Phone Number *
            </label>
            <div className="flex gap-2">
              {/* Country selector */}
              <div className="relative">
                <select
                  value={getCountryCode()}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] focus:ring-2 focus:ring-[#00b0a5]/20 cursor-pointer min-w-[180px]"
                >
                  {COUNTRIES.map((c, i) => (
                    <option key={`${c.iso}-${i}`} value={c.code}>
                      {c.flag} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Number input */}
              <input
                type="tel"
                value={getPhoneNumber()}
                onChange={(e) => handleNumberChange(e.target.value)}
                onBlur={handleNumberBlur}
                placeholder={`${selectedCountry.minLen} digits`}
                className={`${inputClass} flex-1 ${
                  phoneTouched && phoneError
                    ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                    : phoneTouched && isPhoneValid
                    ? "border-green-400 focus:ring-green-400/20 focus:border-green-400"
                    : ""
                }`}
              />
            </div>

            {/* Live feedback */}
            {phoneTouched && phoneError ? (
              <p className="text-xs text-red-500 mt-1.5 font-medium">⚠ {phoneError}</p>
            ) : phoneTouched && isPhoneValid ? (
              <p className="text-xs text-green-600 mt-1.5 font-medium">✓ Valid {selectedCountry.name} number</p>
            ) : (
              <p className="text-xs text-slate-400 mt-1.5">
                {selectedCountry.name}: {selectedCountry.minLen === selectedCountry.maxLen
                  ? `${selectedCountry.minLen} digits required`
                  : `${selectedCountry.minLen}–${selectedCountry.maxLen} digits required`}
              </p>
            )}
          </div>

          {/* Country note for admin context */}
          <div className="flex items-start gap-3 bg-[#00b0a5]/5 border border-[#00b0a5]/15 rounded-xl px-4 py-3">
            <Globe className="w-4 h-4 text-[#00b0a5] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Your selected country{" "}
              <span className="font-bold text-[#00b0a5]">
                {selectedCountry.flag} {selectedCountry.name}
              </span>{" "}
              will be shared with our team so we can prepare for your arrival and communicate in the most convenient way.
            </p>
          </div>
        </div>
      </div>

      {/* ── Additional Notes ── */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#00b0a5]" /> Additional Notes
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Any special requests, preferences, or information for the driver.
        </p>
        <textarea
          value={data.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="E.g. early morning pickup, wheelchair access needed, stop at airport first..."
          rows={5}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* ── Included Services ── */}
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
    </div>
  );
};

export default BookingNotesStep;
