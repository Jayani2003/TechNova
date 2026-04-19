import { Phone, FileText, ChevronDown } from "lucide-react";
 
const COUNTRY_CODES = [
  { code: "+94", country: "🇱🇰 LK" },
  { code: "+1", country: "🇺🇸 US" },
  { code: "+44", country: "🇬🇧 UK" },
  { code: "+61", country: "🇦🇺 AU" },
  { code: "+49", country: "🇩🇪 DE" },
  { code: "+33", country: "🇫🇷 FR" },
  { code: "+81", country: "🇯🇵 JP" },
  { code: "+86", country: "🇨🇳 CN" },
  { code: "+91", country: "🇮🇳 IN" },
  { code: "+65", country: "🇸🇬 SG" },
  { code: "+60", country: "🇲🇾 MY" },
  { code: "+971", country: "🇦🇪 AE" },
  { code: "+966", country: "🇸🇦 SA" },
  { code: "+82", country: "🇰🇷 KR" },
  { code: "+39", country: "🇮🇹 IT" },
  { code: "+34", country: "🇪🇸 ES" },
  { code: "+31", country: "🇳🇱 NL" },
  { code: "+46", country: "🇸🇪 SE" },
  { code: "+47", country: "🇳🇴 NO" },
  { code: "+41", country: "🇨🇭 CH" },
];
 
const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] focus:ring-2 focus:ring-[#00b0a5]/20";
 
const BookingNotesStep = ({ data, onChange }) => {
  // Parse country code and number from data.customerPhone
  const getCountryCode = () => {
    if (!data.customerPhone) return "+94";
    const parts = data.customerPhone.split(" ");
    const found = COUNTRY_CODES.find((c) => c.code === parts[0]);
    return found ? parts[0] : "+94";
  };
 
  const getPhoneNumber = () => {
    if (!data.customerPhone) return "";
    const parts = data.customerPhone.split(" ");
    const found = COUNTRY_CODES.find((c) => c.code === parts[0]);
    return found ? parts.slice(1).join(" ") : data.customerPhone;
  };
 
  const handleCountryChange = (code) => {
    onChange("customerPhone", `${code} ${getPhoneNumber()}`);
  };
 
  const handleNumberChange = (number) => {
    onChange("customerPhone", `${getCountryCode()} ${number}`);
  };
 
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
 
          {/* Phone with country code */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Phone Number *
            </label>
            <div className="flex gap-2">
              {/* Country code dropdown */}
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
 
              {/* Phone number */}
              <input
                type="tel"
                value={getPhoneNumber()}
                onChange={(e) => handleNumberChange(e.target.value)}
                placeholder="77 123 4567"
                className={`${inputClass} flex-1`}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select your country code then enter your number.
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
 