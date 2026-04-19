import { MapPin, Calendar, Clock } from "lucide-react";

const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] focus:ring-2 focus:ring-[#00b0a5]/20";

const P2PTripStep = ({ data, onChange }) => {
  const today = new Date().toISOString().split("T")[0];

  const handleStartDate = (val) => {
    onChange("startDate", val);
    if (data.endDate && val > data.endDate) {
      onChange("endDate", val);
    }
    // Recalculate total days
    if (data.endDate) {
      const diff = Math.ceil(
        (new Date(data.endDate) - new Date(val)) / (1000 * 60 * 60 * 24)
      ) + 1;
      onChange("totalDays", diff > 0 ? diff : 1);
      onChange("daysRequired", diff > 0 ? diff : 1);
    }
  };

  const handleEndDate = (val) => {
    onChange("endDate", val);
    if (data.startDate) {
      const diff = Math.ceil(
        (new Date(val) - new Date(data.startDate)) / (1000 * 60 * 60 * 24)
      ) + 1;
      onChange("totalDays", diff > 0 ? diff : 1);
      onChange("daysRequired", diff > 0 ? diff : 1);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#00b0a5]" /> Trip Locations
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Enter your pickup and drop-off locations anywhere in Sri Lanka.
        </p>

        <div className="space-y-4">
          {/* Start Location */}
          <div className="relative">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Pickup Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00b0a5]" />
              <input
                type="text"
                value={data.startLocation}
                onChange={(e) => onChange("startLocation", e.target.value)}
                placeholder="E.g. Colombo Airport, Kandy Hotel..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="flex items-center gap-3 px-3">
            <div className="flex-1 h-px bg-slate-200" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-[#00b0a5]/10 flex items-center justify-center">
                <span className="text-[#00b0a5] text-lg">↓</span>
              </div>
              <span className="text-xs text-slate-400">One way</span>
            </div>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* End Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Drop-off Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
              <input
                type="text"
                value={data.endLocation}
                onChange={(e) => onChange("endLocation", e.target.value)}
                placeholder="E.g. Galle Fort, Ella, Sigiriya..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#00b0a5]" /> Travel Dates
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          When would you like to travel?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              min={today}
              value={data.startDate}
              onChange={(e) => handleStartDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              min={data.startDate || today}
              value={data.endDate}
              onChange={(e) => handleEndDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Pickup Time */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" /> Preferred Pickup Time *
          </label>
          <input
            type="time"
            value={data.pickupTime}
            onChange={(e) => onChange("pickupTime", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Total days display */}
        {data.totalDays > 0 && (
          <div className="mt-4 bg-[#00b0a5]/5 border border-[#00b0a5]/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00b0a5]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#00b0a5]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {data.totalDays} {data.totalDays === 1 ? "Day" : "Days"} Trip
              </p>
              <p className="text-xs text-slate-500">
                {data.startDate} → {data.endDate}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default P2PTripStep;
