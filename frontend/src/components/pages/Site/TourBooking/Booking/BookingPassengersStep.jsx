import { Users, Briefcase, Car, Baby } from "lucide-react";

const VEHICLE_CATEGORIES = [
  { id: "mini_car", label: "Mini Car", desc: "2 adults, 1 luggage", icon: "🚗" },
  { id: "normal_car", label: "Normal Car", desc: "3 adults, 2 luggage", icon: "🚙" },
  { id: "sedan_car", label: "Sedan Car", desc: "4 adults, 3 luggage", icon: "🚘" },
  { id: "mpv", label: "MPV", desc: "6 adults, 4 luggage", icon: "🚐" },
  { id: "suv", label: "SUV", desc: "5 adults, 4 luggage", icon: "🛻" },
  { id: "mini_van", label: "Mini Van", desc: "8 adults, 5 luggage", icon: "🚌" },
  { id: "van", label: "Van", desc: "10 adults, 6 luggage", icon: "🚌" },
  { id: "large_van", label: "Large Van", desc: "14 adults, 8 luggage", icon: "🚌" },
];

const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] focus:ring-2 focus:ring-[#00b0a5]/20";

const BookingPassengersStep = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* ── Passengers ── */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#00b0a5]" /> Passengers
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Tell us how many people will be travelling.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Adults */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Number of Adults *
            </label>
            <input
              type="number"
              min="1"
              value={data.noOfAdults}
              onChange={(e) => onChange("noOfAdults", parseInt(e.target.value) || 1)}
              className={inputClass}
            />
          </div>

          {/* Children */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Number of Children
            </label>
            <input
              type="number"
              min="0"
              value={data.noOfChildren}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onChange("noOfChildren", val);
                if (val === 0) {
                  onChange("agesOfChildren", "");
                  onChange("babySeatNeeded", false);
                }
              }}
              className={inputClass}
            />
          </div>

          {/* Ages of children — shown only if children > 0 */}
          {data.noOfChildren > 0 && (
            <>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Ages of Children *
                </label>
                <input
                  type="text"
                  value={data.agesOfChildren}
                  onChange={(e) => onChange("agesOfChildren", e.target.value)}
                  placeholder='E.g. "3, 7, 12"'
                  className={inputClass}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Enter each child's age separated by a comma.
                </p>
              </div>

              {/* Baby seat */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={data.babySeatNeeded || false}
                      onChange={(e) => onChange("babySeatNeeded", e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      data.babySeatNeeded
                        ? "bg-[#00b0a5] border-[#00b0a5]"
                        : "border-slate-300 bg-white group-hover:border-[#00b0a5]"
                    }`}>
                      {data.babySeatNeeded && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                      <Baby className="w-4 h-4 text-[#00b0a5]" />
                      Baby Seat Required
                    </p>
                    <p className="text-xs text-slate-400">
                      Tick if any child needs a baby seat
                    </p>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Luggage ── */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#00b0a5]" /> Luggage
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Helps us assign the right vehicle size for your bags.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Small Luggage (cabin size)
            </label>
            <input
              type="number"
              min="0"
              value={data.smallLuggages}
              onChange={(e) => onChange("smallLuggages", parseInt(e.target.value) || 0)}
              className={inputClass}
              placeholder="0"
            />
            <p className="text-xs text-slate-400 mt-1">E.g. backpacks, cabin bags</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Large Luggage (check-in size)
            </label>
            <input
              type="number"
              min="0"
              value={data.largeLuggages}
              onChange={(e) => onChange("largeLuggages", parseInt(e.target.value) || 0)}
              className={inputClass}
              placeholder="0"
            />
            <p className="text-xs text-slate-400 mt-1">E.g. suitcases, large bags</p>
          </div>
        </div>
      </div>

      {/* ── Vehicle Category ── */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Car className="w-5 h-5 text-[#00b0a5]" /> Preferred Vehicle Category *
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Admin will assign an actual vehicle from this category after confirming your booking.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {VEHICLE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange("categoryId", cat.id)}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                data.categoryId === cat.id
                  ? "border-[#00b0a5] bg-[#00b0a5]/5 shadow-md shadow-[#00b0a5]/10"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span className={`text-xs font-bold ${data.categoryId === cat.id ? "text-[#00b0a5]" : "text-slate-700"}`}>
                {cat.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">{cat.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingPassengersStep;
