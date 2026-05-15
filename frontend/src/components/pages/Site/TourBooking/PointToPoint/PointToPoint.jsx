import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Send, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { AuthContext } from "../../../../../context/AuthContext";
import { submitP2PBooking, updateBooking } from "../../../../../services/bookingService";
import P2PHeader from "./P2PHeader";
import BookingStepIndicator from "../Booking/BookingStepIndicator";
import P2PTripStep from "./P2PTripStep";
import BookingPassengersStep from "../Booking/BookingPassengersStep";
import BookingNotesStep from "../Booking/BookingNotesStep";
import P2PReviewStep from "./P2PReviewStep";
import P2PSidePanel from "./P2PSidePanel";
 
const STEPS = ["Trip Details", "Passengers", "More Info", "Review"];
 
const initialData = {
  tourType:       "P2P",
  startLocation:  "",
  endLocation:    "",
  startDate:      "",
  endDate:        "",
  pickupTime:     "",
  totalDays:      0,
  daysRequired:   0,
  noOfAdults:     1,
  noOfChildren:   0,
  agesOfChildren: "",
  babySeatNeeded: false,
  smallLuggages:  0,
  largeLuggages:  0,
  categoryId:     "",
  customerName:   "",
  customerPhone:  "",
  notes:          "",
};
 
// ─── Guest Guard ──────────────────────────────────────────────────────────────
const GuestGuard = ({ navigate }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center max-w-md w-full"
    >
      <div className="w-16 h-16 bg-[#00b0a5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock className="w-8 h-8 text-[#00b0a5]" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Login Required</h2>
      <p className="text-slate-500 text-sm mb-6">
        You need to be logged in to place a booking.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => navigate("/login")}
          className="bg-[#00b0a5] hover:bg-[#009b91] text-white px-6 py-3 rounded-xl font-semibold transition-colors cursor-pointer"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Register
        </button>
      </div>
    </motion.div>
  </div>
);
 
// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ bookingRef, navigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center"
  >
    <div className="w-20 h-20 bg-[#00b0a5]/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle className="w-10 h-10 text-[#00b0a5]" />
    </div>
    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-3">
      Booking Submitted!
    </h2>
    <p className="text-slate-500 text-sm mb-2">Your booking reference is:</p>
    <p className="text-lg font-bold text-[#00b0a5] mb-8">{bookingRef}</p>
    <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-2">
      {[
        "Your booking is now PENDING review",
        "Our team will send a price quote within 24 hours",
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
      className="w-full bg-[#00b0a5] hover:bg-[#009b91] text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 tracking-wide cursor-pointer"
    >
      View My Bookings
    </button>
  </motion.div>
);
 
const validatePhone = (phone) => {
  const number = phone ? phone.split(" ").slice(1).join("") : "";
  const digits = number.replace(/\s/g, "");
  return digits.length >= 7 && digits.length <= 15 && /^\d+$/.test(digits);
};

// ─── Step Validation ──────────────────────────────────────────────────────────
const validateStep = (step, data) => {
  switch (step) {
    case 0: return data.startLocation.trim() && data.endLocation.trim() && data.startDate && data.endDate && data.pickupTime;
    case 1: return data.noOfAdults >= 1 && data.categoryId;
    case 2: return data.customerName.trim() && data.customerPhone.trim() && validatePhone(data.customerPhone);
    case 3: return true;
    default: return false;
  }
};
 
// ─── Main Component ───────────────────────────────────────────────────────────
const PointToPoint = () => {
  const { user } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location = useLocation();
  const editBooking = location.state?.editBooking || null;
 
  const [currentStep, setCurrentStep]         = useState(0);
  const [maxReachedStep, setMaxReachedStep]   = useState(0);
  const [data, setData] = useState(() => {
    if (editBooking) {
      // Parse pickup time from notes
      const pickupTimeMatch = editBooking.notes?.match(/Pickup time: ([^|]+)/);
      const cleanNotes = editBooking.notes
        ?.replace(/Pickup time: [^|]+\|?\s*/g, '')
        ?.replace(/Activities: [^|]+\|?\s*/g, '')
        ?.replace(/Cities: [^|]+\|?\s*/g, '')
        ?.trim();

      // Extract small and large luggage from luggage string
      const luggageMatch = editBooking.noOfLuggages?.match(/Small: (\d+), Large: (\d+)/);

      return {
        ...initialData,
        ...editBooking,
        pickupTime: pickupTimeMatch ? pickupTimeMatch[1].trim() : "",
        notes: cleanNotes || "",
        smallLuggages: luggageMatch ? parseInt(luggageMatch[1]) : 0,
        largeLuggages: luggageMatch ? parseInt(luggageMatch[2]) : 0,
        babySeatNeeded: editBooking.noOfLuggages?.includes("Baby seat needed") || false,
      };
    }
    return initialData;
  });
  const [submitted, setSubmitted]     = useState(false);
  const [bookingRef, setBookingRef]   = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");
 
  if (!user) return <GuestGuard navigate={navigate} />;
 
  const handleChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));
  const handleNext   = () => {
    if (validateStep(currentStep, data)) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setMaxReachedStep((prev) => Math.max(prev, next));
    }
  };
  const handleBack   = () => { setError(""); setCurrentStep((s) => s - 1); };
 
  // ── Submit to real backend ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      if (editBooking) {
        await updateBooking(editBooking.id, {
          ...data,
          customerEmail: user.email,
          tourType: "P2P",
        });
        setBookingRef(editBooking.bookingRef || editBooking.id);
        setSubmitted(true);
        window.scrollTo({ top: 200, behavior: "smooth" });
      } else {
        const result = await submitP2PBooking({
          ...data,
          customerEmail: user.email,
          tourType: "P2P",
        });
        setBookingRef(result.bookingRef);
        setSubmitted(true);
      }
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
 
  const canProceed = validateStep(currentStep, data);
 
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <P2PHeader />
 
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
          {/* ── Left: Form ── */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
            >
              {submitted ? (
                <SuccessScreen bookingRef={bookingRef} navigate={navigate} />
              ) : (
                <>
                  <BookingStepIndicator
                    steps={STEPS}
                    currentStep={currentStep}
                    maxReachedStep={maxReachedStep}
                    onStepClick={(step) => { setError(""); setCurrentStep(step); }}
                  />
 
                  {editBooking && (
                    <div className="mb-6 flex items-center justify-between bg-amber-50 border border-amber-100 rounded-2xl px-5 py-2.5">
                      <p className="text-sm font-bold text-amber-800">Editing Booking: {editBooking.id}</p>
                      <button 
                        onClick={() => {
                          setData(initialData);
                          setCurrentStep(0);
                          navigate(location.pathname, { replace: true, state: {} });
                        }}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
 
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.25 }}
                    >
                      {currentStep === 0 && <P2PTripStep data={data} onChange={handleChange} />}
                      {currentStep === 1 && <BookingPassengersStep data={data} onChange={handleChange} />}
                      {currentStep === 2 && <BookingNotesStep data={data} onChange={handleChange} />}
                      {currentStep === 3 && <P2PReviewStep data={data} />}
                    </motion.div>
                  </AnimatePresence>
 
                  {/* Error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
 
                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                    <button
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
 
                    {currentStep < STEPS.length - 1 ? (
                      <button
                        onClick={handleNext}
                        disabled={!canProceed}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00b0a5] hover:bg-[#009b91] text-white font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#00b0a5] hover:bg-[#009b91] text-white font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <><Send className="w-4 h-4" /> Submit Booking</>
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
 
          {/* ── Right: Side Panel ── */}
          <div className="lg:col-span-1">
            <P2PSidePanel />
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default PointToPoint;
 
