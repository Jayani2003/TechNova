import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Users, Car, Phone, FileText, Clock, Baby, Briefcase, Check, X } from "lucide-react";
import { STATUS_STYLES, TOUR_TYPE_LABEL } from "./MyBookingCard";
import { useBookings } from "../../../../context/BookingsContext.jsx";
 
const VEHICLE_LABELS = {
  mini_car:   "Mini Car",
  normal_car: "Normal Car",
  sedan_car:  "Sedan Car",
  mpv:        "MPV",
  suv:        "SUV",
  mini_van:   "Mini Van",
  van:        "Van",
  large_van:  "Large Van",
};
 
const DetailRow = ({ icon: Icon, label, value }) =>
  value !== undefined && value !== "" && value !== null ? (
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
 
const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
    {children}
  </div>
);
 
const MyBookingDetail = ({ booking, onBack }) => {
  const { acceptQuote, rejectQuote } = useBookings();
 
  const statusSteps = [
    "PENDING", "QUOTED", "ACCEPTED", "CONFIRMED",
    "TOUR_STARTED", "COMPLETED", "CLOSED",
  ];
  const currentStepIndex = statusSteps.indexOf(booking.status);
 
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-800">{booking.id}</h2>
          <p className="text-xs text-slate-500">{TOUR_TYPE_LABEL[booking.tourType]}</p>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${STATUS_STYLES[booking.status] || "bg-slate-100 text-slate-600"}`}>
          {booking.status}
        </span>
      </div>
 
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Status Timeline */}
        <Section title="Booking Progress">
          <div className="flex items-center gap-1 flex-wrap">
            {statusSteps.map((step, i) => {
              const isDone = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={step} className="flex items-center gap-1">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
                    isCurrent
                      ? "bg-[#00b0a5] text-white"
                      : isDone
                      ? "bg-[#00b0a5]/20 text-[#00b0a5]"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    {isDone && !isCurrent && <Check className="w-2.5 h-2.5" />}
                    {step.replace("_", " ")}
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`w-3 h-0.5 ${i < currentStepIndex ? "bg-[#00b0a5]" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </Section>
 
        {/* Quote Action */}
        {booking.status === "QUOTED" && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="text-sm font-bold text-slate-800 mb-1">Price Quote Received!</p>
            <p className="text-2xl font-bold text-[#00b0a5] mb-3">${booking.quotedPrice}</p>
            <p className="text-xs text-slate-500 mb-4">
              Please accept or reject this quote to proceed with your booking.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => acceptQuote(booking.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#00b0a5] text-white py-2.5 rounded-xl font-semibold hover:bg-[#009b91] transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" /> Accept Quote
              </button>
              <button
                onClick={() => rejectQuote(booking.id)}
                className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        )}
 
        {/* Trip Details */}
        <Section title="Trip Details">
          {booking.tourType === "P2P" && (
            <>
              <DetailRow icon={MapPin} label="Pickup Location" value={booking.startLocation} />
              <DetailRow icon={MapPin} label="Drop-off Location" value={booking.endLocation} />
            </>
          )}
          <DetailRow icon={Calendar} label="Start Date" value={booking.startDate} />
          <DetailRow icon={Calendar} label="End Date" value={booking.endDate} />
          <DetailRow icon={Clock} label="Pickup Time" value={booking.pickupTime} />
          <DetailRow icon={Calendar} label="Total Days" value={booking.totalDays ? `${booking.totalDays} day(s)` : null} />
        </Section>
 
        {/* Passengers */}
        <Section title="Passengers & Vehicle">
          <DetailRow icon={Users} label="Adults" value={booking.noOfAdults ? `${booking.noOfAdults} adult(s)` : null} />
          {booking.noOfChildren > 0 && (
            <DetailRow icon={Users} label="Children" value={`${booking.noOfChildren} child(ren) — Ages: ${booking.agesOfChildren || "not specified"}`} />
          )}
          {booking.babySeatNeeded && (
            <DetailRow icon={Baby} label="Baby Seat" value="Required" />
          )}
          <DetailRow
            icon={Briefcase}
            label="Luggage"
            value={
              (booking.smallLuggages !== undefined || booking.largeLuggages !== undefined)
                ? `${booking.smallLuggages || 0} small, ${booking.largeLuggages || 0} large`
                : booking.noOfLuggages
                ? `${booking.noOfLuggages} piece(s)`
                : null
            }
          />
          <DetailRow icon={Car} label="Vehicle Category" value={VEHICLE_LABELS[booking.categoryId] || booking.categoryId} />
        </Section>
 
        {/* Contact */}
        <Section title="Contact Details">
          <DetailRow icon={Phone} label="Name" value={booking.customerName} />
          <DetailRow icon={Phone} label="Phone" value={booking.customerPhone} />
          {booking.notes && <DetailRow icon={FileText} label="Notes" value={booking.notes} />}
        </Section>
 
        {/* Submitted */}
        <Section title="Booking Info">
          <DetailRow icon={Calendar} label="Submitted On" value={booking.createdAt} />
          <DetailRow icon={FileText} label="Booking Reference" value={booking.id} />
        </Section>
      </div>
    </motion.div>
  );
};
 
export default MyBookingDetail;
 