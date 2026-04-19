import { MapPin, Calendar, Users, Car, Phone, FileText, Clock } from "lucide-react";

const VEHICLE_LABELS = {
  mini_car: "Mini Car",
  normal_car: "Normal Car",
  sedan_car: "Sedan Car",
  mpv: "MPV",
  suv: "SUV",
  mini_van: "Mini Van",
  van: "Van",
  large_van: "Large Van",
};

const ReviewRow = ({ icon: Icon, label, value }) =>
  value ? (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 bg-[#00b0a5]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[#00b0a5]" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  ) : null;

const P2PReviewStep = ({ data }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">Review Your Booking</h3>
      <p className="text-sm text-slate-500">
        Please review all details before submitting. Our team will respond with a price quote within 24 hours.
      </p>
    </div>

    {/* Booking type badge */}
    <div className="inline-flex items-center gap-2 bg-[#00b0a5]/10 text-[#00b0a5] px-4 py-2 rounded-full text-sm font-bold">
      🚗 Point-to-Point Transfer
    </div>

    {/* Trip Details */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Trip Details</p>
      <ReviewRow icon={MapPin} label="Pickup Location" value={data.startLocation} />
      <ReviewRow icon={MapPin} label="Drop-off Location" value={data.endLocation} />
      <ReviewRow icon={Calendar} label="Travel Dates" value={`${data.startDate} → ${data.endDate}`} />
      <ReviewRow icon={Clock} label="Pickup Time" value={data.pickupTime} />
      <ReviewRow icon={Calendar} label="Total Days" value={`${data.totalDays} day(s)`} />
    </div>

    {/* Passengers & Vehicle */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Passengers & Vehicle</p>
      <ReviewRow icon={Users} label="Adults" value={`${data.noOfAdults} adult(s)`} />
      {data.noOfChildren > 0 && (
        <ReviewRow icon={Users} label="Children" value={`${data.noOfChildren} child(ren) — Ages: ${data.agesOfChildren || "not specified"}`} />
      )}
      <ReviewRow icon={Car} label="Luggage" value={`${data.smallLuggages || 0} small, ${data.largeLuggages || 0} large`} />
      <ReviewRow icon={Car} label="Vehicle Category" value={VEHICLE_LABELS[data.categoryId] || data.categoryId} />
    </div>

    {/* Contact */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contact</p>
      <ReviewRow icon={Phone} label="Name" value={data.customerName} />
      <ReviewRow icon={Phone} label="Phone" value={data.customerPhone} />
      {data.notes && <ReviewRow icon={FileText} label="Additional Notes" value={data.notes} />}
    </div>

    {/* What happens next */}
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <p className="text-sm font-bold text-slate-700 mb-3">What happens after you submit?</p>
      {[
        "Your booking is submitted with status: PENDING",
        "Our team reviews your request within 24 hours",
        "We'll send you a price quote through the system",
        "You accept or reject the quote from your profile",
        "Once accepted, we confirm and assign your vehicle",
      ].map((step, i) => (
        <div key={i} className="flex items-start gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-[#00b0a5] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
            {i + 1}
          </div>
          <p className="text-sm text-slate-600">{step}</p>
        </div>
      ))}
    </div>
  </div>
);

export default P2PReviewStep;
