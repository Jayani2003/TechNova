import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Send, MapPin, Lock } from "lucide-react";
import { AuthContext } from "../../../../../context/AuthContext";
import { useContext } from "react";
import { useBookings } from "../../../../../context/BookingsContext.jsx";
import BookingStepIndicator from "../Booking/BookingStepIndicator";
import P2PTripStep from "./P2PTripStep";
import BookingPassengersStep from "../Booking/BookingPassengersStep";
import BookingNotesStep from "../Booking/BookingNotesStep";
import P2PReviewStep from "./P2PReviewStep";

const STEPS = ["Trip Details", "Passengers", "More Info", "Review"];

const initialData = {
  tourType: "P2P",
  startLocation: "",
  endLocation: "",
  startDate: "",
  endDate: "",
  pickupTime: "",
  totalDays: 0,
  daysRequired: 0,
  noOfAdults: 1,
  noOfChildren: 0,
  agesOfChildren: "",
  babySeatNeeded: false,
  largeLuggages: 0,
  smallLuggages: 0,
  categoryId: "",
  customerName: "",
  customerPhone: "",
  notes: "",
};

// ─── Guest Guard ──────────────────────────────────────────────────────────────
const GuestGuard = ({ navigate }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 text-center max-w-md w-full"
    >
      <div className="w-16 h-16 bg-[#00b0a5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock className="w-8 h-8 text-[#00b0a5]" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Login Required</h2>
      <p className="text-slate-500 text-sm mb-6">
        You need to be logged in to place a booking. Create an account or sign in to continue.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => navigate("/login")}
          className="bg-[#00b0a5] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#009b91] transition-colors"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
        >
          Register
        </button>
      </div>
    </motion.div>
  </div>
);

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ bookingId, navigate }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 text-center"
  >
    <div className="w-20 h-20 bg-[#00b0a5]/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <span className="text-4xl">🎉</span>
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Submitted!</h2>
    <p className="text-slate-500 text-sm mb-2">
      Your booking reference is:
    </p>
    <p className="text-lg font-bold text-[#00b0a5] mb-6">{bookingId}</p>
    <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-2">
      {[
        "Your booking is now PENDING",
        "Our team will review and send a price quote within 24 hours",
        "You can track your booking status from your profile",
      ].map((s, i) => (
        <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
          <span className="text-[#00b0a5] font-bold flex-shrink-0">✓</span>
          {s}
        </div>
      ))}
    </div>
    <button
      onClick={() => navigate("/user/profile")}
      className="bg-[#00b0a5] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#009b91] transition-colors"
    >
      View My Bookings
    </button>
  </motion.div>
);

// ─── Validation per step ──────────────────────────────────────────────────────
const validateStep = (step, data) => {
  switch (step) {
    case 0:
      return (
        data.startLocation.trim() &&
        data.endLocation.trim() &&
        data.startDate &&
        data.endDate &&
        data.pickupTime
      );
    case 1:
      return data.noOfAdults >= 1 && data.categoryId;
    case 2:
      return data.customerName.trim() && data.customerPhone.trim();
    case 3:
      return true;
    default:
      return false;
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PointToPoint = () => {
  const { user } = useContext(AuthContext);
  const { addBooking } = useBookings();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");

  if (!user) return <GuestGuard navigate={navigate} />;

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (validateStep(currentStep, data)) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  const handleSubmit = () => {
    const countryCode = data.countryCode === "+other"
      ? data.customCountryCode
      : data.countryCode;
    const customerPhone = `${countryCode} ${data.phoneNumber}`.trim();
    const booking = addBooking({
      ...data,
      customerPhone,
      customerEmail: user.email,
      noOfLuggages: (data.largeLuggages || 0) + (data.smallLuggages || 0),
      tourType: "P2P",
    });
    setBookingId(booking.id);
    setSubmitted(true);
  };

  const canProceed = validateStep(currentStep, data);

  const stepVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00b0a5] to-[#007b73] text-white py-12 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-10 w-40 h-40 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin className="w-6 h-6" />
            <span className="text-sm font-semibold uppercase tracking-widest opacity-80">
              Point-to-Point Transfer
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Book Your Transfer</h1>
          <p className="text-white/70 text-sm max-w-md mx-auto">
            Reliable one-way transfers between any two locations in Sri Lanka with professional drivers.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8">
          {submitted ? (
            <SuccessScreen bookingId={bookingId} navigate={navigate} />
          ) : (
            <>
              <BookingStepIndicator steps={STEPS} currentStep={currentStep} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                >
                  {currentStep === 0 && (
                    <P2PTripStep data={data} onChange={handleChange} />
                  )}
                  {currentStep === 1 && (
                    <BookingPassengersStep data={data} onChange={handleChange} />
                  )}
                  {currentStep === 2 && (
                    <BookingNotesStep data={data} onChange={handleChange} />
                  )}
                  {currentStep === 3 && <P2PReviewStep data={data} />}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                {currentStep < STEPS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00b0a5] text-white font-semibold hover:bg-[#009b91] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-[#00b0a5]/20"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00b0a5] text-white font-semibold hover:bg-[#009b91] transition-colors cursor-pointer shadow-md shadow-[#00b0a5]/20"
                  >
                    <Send className="w-4 h-4" />
                    Submit Booking
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointToPoint;
