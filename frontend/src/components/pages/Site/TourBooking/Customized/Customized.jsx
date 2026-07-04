import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Lock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  Briefcase,
  Car,
  Baby,
  Phone,
  FileText,
  Compass,
  Zap,
} from "lucide-react";
import { AuthContext } from "../../../../../context/AuthContext";
import { submitCustomBooking } from "../../../../../services/bookingService";
import BookingStepIndicator from "../Booking/BookingStepIndicator";
import BookingPassengersStep from "../Booking/BookingPassengersStep";
import BookingNotesStep from "../Booking/BookingNotesStep";
import CustomizedHeader from "./CustomizedHeader";
import { updateBooking } from "../../../../../services/bookingService";

const STEPS = ["Your Plan", "Passengers", "More Info", "Review"];

const PLACE_OPTIONS = [
  "Colombo", "Kandy", "Galle", "Ella", "Sigiriya", "Trincomalee", 
  "Nuwara Eliya", "Mirissa", "Arugam Bay", "Hikkaduwa", "Polonnaruwa", "Anuradhapura",
];

const ACTIVITY_OPTIONS = [
  "Diving", "Water Rafting", "Kayaking", "Hiking", "Snorkeling Safari", 
  "Kite Surfing", "Whale Watching",
];

const initialData = {
  tourType:       "CUSTOM",
  selectedCities: [],
  activities:     [],
  startDate:      "",
  endDate:        "",
  pickupTime:     "",
  totalDays:      1,
  daysRequired:   1,
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
  tourThoughts:   "",
};

// ─── Guest Guard ──────────────────────────────────────────────────────────────
const GuestGuard = ({ navigate }) => {
  
  return (
  <div className="min-h-screen bg-[#f7fffe] flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-[#00b0a5]/10 shadow-xl p-10 text-center max-w-md w-full"
    >
      <div className="w-20 h-20 bg-[#00b0a5]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock className="w-10 h-10 text-[#00b0a5]" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter uppercase">{"Login Required"}</h2>
      <p className="text-slate-500 text-base mb-8">
        {"You need to be logged in to design and book your own customized Sri Lankan adventure."}
      </p>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate("/login")}
          className="bg-[#00b0a5] hover:bg-[#008f86] text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#00b0a5]/20 cursor-pointer"
        >
          {"Sign In"}
        </button>
        <button
          onClick={() => navigate("/register")}
          className="border-2 border-[#00b0a5]/20 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-[#00b0a5]/5 transition-all cursor-pointer"
        >
          {"Create Account"}
        </button>
      </div>
    </motion.div>
  </div>
  );
};

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ bookingRef, navigate }) => {
  
  return (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="text-center py-8"
  >
    <div className="w-24 h-24 bg-[#00b0a5]/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
      <CheckCircle className="w-12 h-12 text-[#00b0a5]" />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-[#00b0a5]/20 rounded-full"
      />
    </div>
    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4 uppercase">
      {"Your Journey Awaits!"}
    </h2>
    <p className="text-slate-500 text-lg mb-2 font-medium">{"Booking Reference:"}</p>
    <p className="text-2xl font-black text-[#00b0a5] mb-10 tracking-widest bg-[#00b0a5]/5 inline-block px-6 py-2 rounded-full border border-[#00b0a5]/20">{bookingRef}</p>
    
    <div className="bg-[#f7fffe] rounded-3xl p-8 mb-10 text-left border border-[#00b0a5]/10 shadow-sm space-y-4 max-w-lg mx-auto">
      <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs mb-2">{"Next Steps:"}</h4>
      {[
        "Our travel experts will review your custom itinerary",
        "A personalized price quote will be sent to your profile",
        "You'll receive an email notification once reviewed",
        "Accept the quote to finalize your dream vacation"
      ].map((s, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="w-6 h-6 bg-[#00b0a5] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
            {i + 1}
          </div>
          <p className="text-slate-600 font-medium">{s}</p>
        </div>
      ))}
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={() => navigate("/user/profile")}
        className="bg-[#00b0a5] hover:bg-[#008f86] text-white px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#00b0a5]/20 flex items-center justify-center gap-2 tracking-widest cursor-pointer uppercase text-sm"
      >
        {"View My Bookings"}
      </button>
      <button
        onClick={() => window.location.href = "/"}
        className="bg-white border-2 border-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-black transition-all hover:bg-slate-50 flex items-center justify-center gap-2 tracking-widest cursor-pointer uppercase text-sm"
      >
        {"Back to Home"}
      </button>
    </div>
  </motion.div>
  );
};

const validateStep = (step, data, user) => {
  switch (step) {
    case 0:
      if (!data.tourThoughts?.trim()) return { valid: false, msg: "Please share your Dream Itinerary with us." };
      if (data.selectedCities.length > 7) return { valid: false, msg: "Maximum 7 destinations allowed." };
      if (data.activities.length > 7) return { valid: false, msg: "Maximum 7 activities allowed." };
      if (!data.startDate || !data.endDate || !data.pickupTime) return { valid: false, msg: "Please select travel dates and pickup time." };
      return { valid: true };
    case 1:
      if (data.noOfAdults < 1) return { valid: false, msg: "At least 1 adult is required." };
      if (!data.categoryId) return { valid: false, msg: "Please select a vehicle category." };
      return { valid: true };
    case 2:
      const finalName = data.customerName?.trim() || user?.name?.trim();
      if (!finalName) return { valid: false, msg: "Please enter your full name." };
      if (!data.contactNumber?.trim()) return { valid: false, msg: "Please enter your primary contact number." };
      return { valid: true };
    case 3:
      return { valid: true };
    default:
      return { valid: false, msg: "Invalid step." };
  }
};

const CustomReviewStep = ({ data, user }) => {
  
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
      <div className="flex items-start gap-4 py-4 border-b border-slate-50 last:border-0">
        <div className="w-10 h-10 bg-[#00b0a5]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-5 h-5 text-[#00b0a5]" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</p>
          <p className="text-base font-bold text-slate-800 mt-0.5">{value}</p>
        </div>
      </div>
    ) : null;

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-[#00b0a5]/10 text-[#00b0a5] px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Compass className="w-4 h-4" /> {"Customized Itinerary"}
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{"Review Your Plan"}</h3>
        <p className="text-sm text-slate-500 mt-2">
          {"Almost there! Please verify your travel details before submitting."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 hover:shadow-md transition-shadow">
          <p className="text-xs font-black text-[#00b0a5] uppercase tracking-widest mb-6 border-b border-[#00b0a5]/10 pb-4">{"Destinations & Dates"}</p>
          <ReviewRow icon={MapPin} label={"Route"} value={data.selectedCities.join(" → ")} />
          <ReviewRow icon={Zap} label={"Activities"} value={data.activities.length > 0 ? data.activities.join(", ") : "Sightseeing"} />
          <ReviewRow icon={Calendar} label={"Travel Period"} value={`${data.startDate} to ${data.endDate}`} />
          <ReviewRow icon={Clock} label={"Pickup Time"} value={data.pickupTime} />
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 hover:shadow-md transition-shadow">
          <p className="text-xs font-black text-[#00b0a5] uppercase tracking-widest mb-6 border-b border-[#00b0a5]/10 pb-4">{"Passengers & Vehicle"}</p>
          <ReviewRow icon={Users} label={"Travelers"} value={`${data.noOfAdults} Adults${data.noOfChildren > 0 ? `, ${data.noOfChildren} Children` : ""}`} />
          <ReviewRow icon={Car} label={"Vehicle Type"} value={VEHICLE_LABELS[data.categoryId] || "Not Selected"} />
          <ReviewRow icon={Briefcase} label={"Luggage"} value={`${data.smallLuggages || 0} Small, ${data.largeLuggages || 0} Large`} />
          <ReviewRow icon={Phone} label={"Contact Name"} value={data.customerName || user?.name || "Not Specified"} />
          <ReviewRow icon={Phone} label={"Contact Info"} value={`${data.contactPlatform || 'Mobile'}: ${data.contactNumber || ''}`} />
        </div>
      </div>

      {data.tourThoughts && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
           <p className="text-xs font-black text-[#00b0a5] uppercase tracking-widest mb-4">{"Traveler's Thoughts"}</p>
           <p className="text-slate-600 font-medium italic leading-relaxed mb-4">"{data.tourThoughts}"</p>
           <div className="bg-[#f7fffe] p-4 rounded-2xl border border-[#00b0a5]/10 flex items-center gap-3">
             <div className="w-8 h-8 bg-[#00b0a5]/10 rounded-full flex items-center justify-center flex-shrink-0">
               <Zap className="w-4 h-4 text-[#00b0a5]" />
             </div>
             <p className="text-xs text-slate-500 font-medium italic" dangerouslySetInnerHTML={{ __html: "Note: These details will be carefully reviewed by the Ceylon Best Tour team. We will plan the most efficient route and handle all necessary arrangements (hotels, permits, etc.) based on your ideas." }}>
             </p>
           </div>
        </div>
      )}

      {data.notes && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
           <p className="text-xs font-black text-[#00b0a5] uppercase tracking-widest mb-4">{"Special Requests"}</p>
           <p className="text-slate-600 font-medium italic">"{data.notes}"</p>
        </div>
      )}

      <div className="bg-[#00b0a5]/5 rounded-3xl p-8 border border-[#00b0a5]/10">
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">{"Submission Notice"}</h4>
        <p className="text-sm text-slate-600 leading-relaxed">
          {"By clicking \"Submit Booking\", your request will be sent to our team for manual review. We will calculate the best possible price based on your route and requirements. No payment is required at this stage."}
        </p>
      </div>
    </div>
  );
};

const CustomSidePanel = () => {
  
  return (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="space-y-6"
  >
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
      <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter">{"Your Process"}</h2>
      <div className="space-y-8">
        {[
          { title: "Design", desc: "Pick your stops and activities.", icon: <MapPin className="w-4 h-4" /> },
          { title: "Review", desc: "Our team crafts the best price.", icon: <Clock className="w-4 h-4" /> },
          { title: "Embark", desc: "Approve and start your tour.", icon: <CheckCircle className="w-4 h-4" /> },
        ].map(({ title, desc, icon }, idx) => (
          <div key={title} className="flex gap-5 relative">
            {idx < 2 && <div className="absolute left-6 top-10 bottom-[-32px] w-0.5 bg-slate-100" />}
            <div className="w-12 h-12 bg-[#f7fffe] border border-[#00b0a5]/20 rounded-2xl flex items-center justify-center text-[#00b0a5] flex-shrink-0 z-10 font-black shadow-sm">
              {icon}
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gradient-to-br from-[#00b0a5] to-[#007a72] rounded-3xl p-8 text-white shadow-xl shadow-[#00b0a5]/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Phone className="w-24 h-24 rotate-12" />
      </div>
      <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">{"Need Assistance?"}</h3>
      <p className="text-sm text-white/80 mb-6 font-medium leading-relaxed">
        {"Let our travel consultants help you build the perfect itinerary."}
      </p>
      <a
        href="tel:+94778619582"
        className="inline-flex items-center gap-3 bg-white text-[#00b0a5] px-6 py-3 rounded-xl font-black hover:bg-slate-50 transition-all text-sm tracking-widest uppercase shadow-lg shadow-black/10"
      >
        <Phone className="w-4 h-4" /> {"Call Experts"}
      </a>
    </div>

    <div className="bg-slate-900 rounded-3xl p-8 text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 bg-[#00b0a5] rounded-full animate-pulse" />
        <p className="text-xs font-black uppercase tracking-widest text-[#00b0a5]">{"Booking Policy"}</p>
      </div>
      <p className="text-xs text-white/60 leading-relaxed font-medium">
        {"Custom tours require manual quotation. Quotes are typically ready within 24 hours. No upfront payment required to submit."}
      </p>
    </div>
  </motion.div>
  );
};

const Customized = () => {
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const editBooking = location.state?.editBooking || null;

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(() => {
    if (editBooking) {
      // Parse pickup time from notes
      const pickupTimeMatch = editBooking.notes?.match(/Pickup time: ([^|]+)/);
      const thoughtsMatch = editBooking.notes?.match(/Traveler Thoughts: ([^|]+)/);
      const cleanNotes = editBooking.notes
        ?.replace(/Pickup time: [^|]+\|?\s*/g, '')
        ?.replace(/Traveler Thoughts: [^|]+\|?\s*/g, '')
        ?.replace(/Activities: [^|]+\|?\s*/g, '')
        ?.replace(/Cities: [^|]+\|?\s*/g, '')
        ?.trim();

      // Extract small and large luggage from luggage string
      const luggageMatch = editBooking.noOfLuggages?.match(/Small: (\d+), Large: (\d+)/);

      // Extract cities and activities from notes (legacy) or just use empty if not found
      const citiesMatch = editBooking.notes?.match(/Cities: ([^|]+)/);
      const activitiesMatch = editBooking.notes?.match(/Activities: ([^|]+)/);

      return {
        ...initialData,
        ...editBooking,
        customerName: editBooking.customerName || user?.name || "",
        contactNumber: editBooking.contactNumber || user?.contact_number || "",
        emergencyName: editBooking.emergencyName || user?.emergency_name || "",
        emergencyPhone: editBooking.emergencyPhone || user?.emergency_phone || "",
        emergencyRelationship: editBooking.emergencyRelationship || user?.emergency_relationship || "",
        selectedCities: citiesMatch ? citiesMatch[1].split(', ') : [],
        activities: activitiesMatch ? activitiesMatch[1].split(', ') : [],
        pickupTime: pickupTimeMatch ? pickupTimeMatch[1].trim() : "",
        tourThoughts: thoughtsMatch ? thoughtsMatch[1].trim() : "",
        notes: cleanNotes || "",
        smallLuggages: luggageMatch ? parseInt(luggageMatch[1]) : 0,
        largeLuggages: luggageMatch ? parseInt(luggageMatch[2]) : 0,
        babySeatNeeded: editBooking.noOfLuggages?.includes("Baby seat needed") || false,
      };
    }
    return { 
      ...initialData, 
      customerName: user?.name || "",
      contactNumber: user?.contact_number || "",
      emergencyName: user?.emergency_name || "",
      emergencyPhone: user?.emergency_phone || "",
      emergencyRelationship: user?.emergency_relationship || "",
    };
  });
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!user) return <GuestGuard navigate={navigate} />;

  const handleChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleAddCity = () => {
    if (!selectedCity) return;
    if (data.selectedCities.length >= 7) {
      setError("You can select a maximum of 7 destinations.");
      return;
    }
    if (!data.selectedCities.includes(selectedCity)) {
      handleChange("selectedCities", [...data.selectedCities, selectedCity]);
      setError("");
    }
    setSelectedCity("");
  };

  const handleRemoveCity = (city) => {
    handleChange("selectedCities", data.selectedCities.filter((item) => item !== city));
  };

  const handleAddActivity = () => {
    if (!selectedActivity) return;
    if (data.activities.length >= 7) {
      setError("You can select a maximum of 7 activities.");
      return;
    }
    if (!data.activities.includes(selectedActivity)) {
      handleChange("activities", [...data.activities, selectedActivity]);
      setError("");
    }
    setSelectedActivity("");
  };

  const handleRemoveActivity = (activity) => {
    handleChange("activities", data.activities.filter((item) => item !== activity));
  };

  const handleStartDate = (val) => {
    handleChange("startDate", val);
    if (data.endDate && val > data.endDate) {
      handleChange("endDate", val);
    }
    if (data.endDate) {
      const diff = Math.ceil((new Date(data.endDate) - new Date(val)) / (1000 * 60 * 60 * 24)) + 1;
      handleChange("totalDays", diff > 0 ? diff : 1);
      handleChange("daysRequired", diff > 0 ? diff : 1);
    }
  };

  const handleEndDate = (val) => {
    handleChange("endDate", val);
    if (data.startDate) {
      const diff = Math.ceil((new Date(val) - new Date(data.startDate)) / (1000 * 60 * 60 * 24)) + 1;
      handleChange("totalDays", diff > 0 ? diff : 1);
      handleChange("daysRequired", diff > 0 ? diff : 1);
    }
  };

  const handleNext = () => {
    const validation = validateStep(currentStep, data, user);
    if (validation.valid) {
      setError("");
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 400, behavior: "smooth" });
    } else {
      setError(validation.msg || "Please complete all required fields.");
      // Specific popup for phone number validation
      if (validation.msg && validation.msg.includes("9 digits")) {
        alert(validation.msg);
      }
    }
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      if (editBooking) {
        await updateBooking(editBooking.id, {
          ...data,
          customerName: data.customerName || user?.name || "Not Specified",
          customerEmail: user.email,
        });
        setBookingRef(editBooking.bookingRef || editBooking.id);
        setSubmitted(true);
        window.scrollTo({ top: 200, behavior: "smooth" });
      } else {
        const result = await submitCustomBooking({
          ...data,
          customerName: data.customerName || user?.name || "Not Specified",
          customerEmail: user.email,
        });
        setBookingRef(result.bookingRef);
        setSubmitted(true);
        window.scrollTo({ top: 200, behavior: "smooth" });
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = validateStep(currentStep, data, user).valid;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#f7fffe] pb-24 relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1586611292717-f828b1ad740b?q=80&w=1200" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      <CustomizedHeader />

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-[2rem] border border-[#00b0a5]/10 shadow-2xl shadow-[#00b0a5]/5 overflow-hidden"
            >
              <div className="p-8 md:p-12">
                {submitted ? (
                  <SuccessScreen bookingRef={bookingRef} navigate={navigate} />
                ) : (
                  <>
                    <BookingStepIndicator steps={[
  "Your Plan",
  "Passengers",
  "More Info",
  "Review"
]} currentStep={currentStep} />
                    
                    {editBooking && (
                      <div className="mb-6 flex items-center justify-between bg-amber-50 border border-amber-100 rounded-2xl px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                          <p className="text-sm font-bold text-amber-800">{"Editing Booking:"} <span className="font-mono">{editBooking.id}</span></p>
                        </div>
                        <button 
                          onClick={() => {
                            setData(initialData);
                            setCurrentStep(0);
                            navigate(location.pathname, { replace: true, state: {} });
                          }}
                          className="text-xs font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors cursor-pointer"
                        >
                          {"Cancel Edit"}
                        </button>
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mt-12"
                      >
                        {currentStep === 0 && (
                          <div className="space-y-10">
                            <section>
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-[#00b0a5]/10 rounded-2xl flex items-center justify-center text-[#00b0a5]">
                                  <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{"Your Dream Itinerary"}</h3>
                                  <p className="text-sm text-slate-500">
                                    {"Tell us everything! Where do you want to go? What did your friends recommend? Just share your ideas, and our experts will craft the perfect route for you."}
                                  </p>
                                </div>
                              </div>
                              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-10">
                                <textarea
                                  value={data.tourThoughts}
                                  onChange={(e) => handleChange("tourThoughts", e.target.value)}
                                  placeholder={"E.g. I heard from a friend that Mirissa is amazing for surfing... I also really want to try hiking in Ella..."}
                                  rows={4}
                                  className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] font-medium resize-none"
                                />
                                <p className="text-xs text-slate-400 mt-3 italic">
                                  {"Your input here is incredibly valuable for our team to design your ideal journey."}
                                </p>
                              </div>
                            </section>

                            <section>
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-[#00b0a5]/10 rounded-2xl flex items-center justify-center text-[#00b0a5]">
                                  <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{"Pick Your Stops"}</h3>
                                  <p className="text-sm text-slate-500">
                                    {"Below is a list of the most loved destinations and activities from our past travelers. Add the ones you're excited about, and our admins will organize them logically!"}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                <div className="space-y-2">
                                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest ml-1">{"Add Destination"} <span className="text-[#00b0a5]">{"(Max 7)"}</span></label>
                                  <div className="flex gap-2">
                                    <select
                                      value={selectedCity}
                                      onChange={(e) => setSelectedCity(e.target.value)}
                                      className="flex-1 px-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] font-semibold"
                                    >
                                      <option value="">{"Select a city..."}</option>
                                      {PLACE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <button
                                      type="button"
                                      onClick={handleAddCity}
                                      className="bg-[#00b0a5] text-white px-6 rounded-2xl font-black hover:bg-[#008f86] transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-[#00b0a5]/20"
                                    >
                                      {"Add"}
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest ml-1">{"Add Activity"} <span className="text-[#00b0a5]">{"(Max 7)"}</span></label>
                                  <div className="flex gap-2">
                                    <select
                                      value={selectedActivity}
                                      onChange={(e) => setSelectedActivity(e.target.value)}
                                      className="flex-1 px-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] font-semibold"
                                    >
                                      <option value="">{"Select an activity..."}</option>
                                      {ACTIVITY_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                    <button
                                      type="button"
                                      onClick={handleAddActivity}
                                      className="bg-[#00b0a5] text-white px-6 rounded-2xl font-black hover:bg-[#008f86] transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-[#00b0a5]/20"
                                    >
                                      {"Add"}
                                    </button>
                                  </div>
                                </div>

                                <div className="md:col-span-2 space-y-6 mt-4">
                                  <div>
                                    <p className="text-xs font-black text-[#00b0a5] uppercase tracking-widest mb-3 ml-1">{"Route Itinerary"}</p>
                                    <div className="flex flex-wrap gap-2">
                                      {data.selectedCities.length > 0 ? (
                                        data.selectedCities.map((city) => (
                                          <motion.span 
                                            layout
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            key={city} 
                                            className="inline-flex items-center gap-2 bg-white border-2 border-[#00b0a5]/20 text-[#008f86] rounded-xl px-4 py-2 text-sm font-bold shadow-sm"
                                          >
                                            {city}
                                            <button onClick={() => handleRemoveCity(city)} className="text-red-400 hover:text-red-600 transition-colors ml-1">×</button>
                                          </motion.span>
                                        ))
                                      ) : (
                                        <div className="w-full py-4 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium">{"Select up to 7 destinations for your route"}</div>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-xs font-black text-[#00b0a5] uppercase tracking-widest mb-3 ml-1">{"Selected Activities"}</p>
                                    <div className="flex flex-wrap gap-2">
                                      {data.activities.length > 0 ? (
                                        data.activities.map((act) => (
                                          <motion.span 
                                            layout
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            key={act} 
                                            className="inline-flex items-center gap-2 bg-[#00b0a5] text-white rounded-xl px-4 py-2 text-sm font-bold shadow-md shadow-[#00b0a5]/10"
                                          >
                                            {act}
                                            <button onClick={() => handleRemoveActivity(act)} className="text-white/70 hover:text-white transition-colors ml-1">×</button>
                                          </motion.span>
                                        ))
                                      ) : (
                                        <div className="w-full py-4 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium">{"Choose up to 7 adventure activities"}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>

                            <section>
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-[#00b0a5]/10 rounded-2xl flex items-center justify-center text-[#00b0a5]">
                                  <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{"Travel Dates"}</h3>
                                  <p className="text-sm text-slate-500">{"When would you like to start your journey?"}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[2rem] border-2 border-[#f7fffe] shadow-sm">
                                <div className="space-y-2">
                                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest ml-1">{"Departure Date *"}</label>
                                  <input
                                    type="date"
                                    min={today}
                                    value={data.startDate}
                                    onChange={(e) => handleStartDate(e.target.value)}
                                    className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] font-semibold [color-scheme:light]"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest ml-1">{"Return Date *"}</label>
                                  <input
                                    type="date"
                                    min={data.startDate || today}
                                    value={data.endDate}
                                    onChange={(e) => handleEndDate(e.target.value)}
                                    className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] font-semibold [color-scheme:light]"
                                  />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest ml-1">{"Pickup Time *"}</label>
                                  <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    <input
                                      type="time"
                                      value={data.pickupTime}
                                      onChange={(e) => handleChange("pickupTime", e.target.value)}
                                      className="w-full pl-12 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] font-semibold [color-scheme:light]"
                                    />
                                  </div>
                                </div>

                                {data.totalDays > 0 && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="md:col-span-2 bg-[#00b0a5] rounded-2xl p-6 text-white flex items-center justify-between shadow-xl shadow-[#00b0a5]/20"
                                  >
                                    <div>
                                      <p className="text-xs font-black uppercase tracking-widest opacity-80">{"Total Duration"}</p>
                                      <p className="text-2xl font-black">{data.totalDays} {data.totalDays === 1 ? "Full Day" : "Incredible Days"}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs font-black uppercase tracking-widest opacity-80">{"Trip Range"}</p>
                                      <p className="text-sm font-bold">{data.startDate} — {data.endDate}</p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </section>
                          </div>
                        )}
                        {currentStep === 1 && <BookingPassengersStep data={data} onChange={handleChange} />}
                        {currentStep === 2 && <BookingNotesStep data={data} onChange={handleChange} />}
                        {currentStep === 3 && <CustomReviewStep data={data} user={user} />}
                      </motion.div>
                    </AnimatePresence>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 flex items-center gap-3 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl px-6 py-4 text-sm font-bold shadow-sm"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                      </motion.div>
                    )}

                    <div className="flex items-center justify-between mt-12 pt-10 border-t-2 border-slate-50">
                      <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-50 hover:text-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" /> {"Back"}
                      </button>
                      {currentStep < STEPS.length - 1 ? (
                        <button
                          onClick={handleNext}
                          disabled={!canProceed}
                          className="flex items-center gap-2 px-10 py-4 rounded-xl bg-[#00b0a5] hover:bg-[#008f86] text-white font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#00b0a5]/20"
                        >
                          {"Next Step"} <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={submitting}
                          className="flex items-center gap-2 px-10 py-4 rounded-xl bg-[#00b0a5] hover:bg-[#008f86] text-white font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-xl shadow-[#00b0a5]/30"
                        >
                          {submitting ? (
                            <>
                              <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                              {"Processing..."}
                            </>
                          ) : (
                            <><Send className="w-4 h-4 mr-2" /> {"Submit Booking"}</>
                          )}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-4">
            <CustomSidePanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customized;
