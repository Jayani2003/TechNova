import { useState, useContext } from "react";
import { useNavigate } from "react-router";
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
} from "lucide-react";
import { AuthContext } from "../../../../../context/AuthContext";
import { submitCustomBooking } from "../../../../../services/bookingService";
import BookingStepIndicator from "../Booking/BookingStepIndicator";
import BookingPassengersStep from "../Booking/BookingPassengersStep";
import BookingNotesStep from "../Booking/BookingNotesStep";

const STEPS = ["Your Plan", "Passengers", "More Info", "Review"];

const PLACE_OPTIONS = [
  "Colombo",
  "Kandy",
  "Galle",
  "Ella",
  "Sigiriya",
  "Trincomalee",
  "Nuwara Eliya",
  "Mirissa",
  "Arugam Bay",
  "Hikkaduwa",
  "Polonnaruwa",
  "Anuradhapura",
];

const ACTIVITY_OPTIONS = [
  "Diving",
  "Water Rafting",
  "Kayaking",
  "Hiking",
  "Snorkeling Safari",
  "Kite Surfing",
  "Whale Watching",
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
};

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
        You need to be logged in to place a customized tour booking.
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
      Customized Tour Requested!
    </h2>
    <p className="text-slate-500 text-sm mb-2">Your booking reference is:</p>
    <p className="text-lg font-bold text-[#00b0a5] mb-8">{bookingRef}</p>
    <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-2">
      {[
        "Your custom plan is sent for review",
        "Our team will send a price quote within 24 hours",
        "Track the status from your profile",
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

const validateStep = (step, data) => {
  switch (step) {
    case 0:
      return (
        data.selectedCities.length > 0 &&
        data.categoryId &&
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

const CustomReviewStep = ({ data }) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Review Your Booking</h3>
        <p className="text-sm text-slate-500">
          Check your custom travel plan before submitting. We will send a quote soon.
        </p>
      </div>

      <div className="inline-flex items-center gap-2 bg-[#00b0a5]/10 text-[#00b0a5] px-4 py-2 rounded-full text-sm font-bold">
        🌍 Customized Tour
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Your Plan</p>
        <ReviewRow icon={MapPin} label="Selected Cities" value={data.selectedCities.join(", ")} />
        <ReviewRow icon={MapPin} label="Activities" value={data.activities.join(", ")} />
        <ReviewRow icon={Calendar} label="Travel Dates" value={`${data.startDate} → ${data.endDate}`} />
        <ReviewRow icon={Clock} label="Preferred Pickup Time" value={data.pickupTime} />
        <ReviewRow icon={Calendar} label="Total Days" value={`${data.totalDays} day(s)`} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Passengers & Vehicle</p>
        <ReviewRow icon={Users} label="Adults" value={`${data.noOfAdults} adult(s)`} />
        {data.noOfChildren > 0 && (
          <ReviewRow
            icon={Users}
            label="Children"
            value={`${data.noOfChildren} child(ren) — Ages: ${data.agesOfChildren || "not specified"}`}
          />
        )}
        <ReviewRow
          icon={Car}
          label="Luggage"
          value={`${data.smallLuggages || 0} small, ${data.largeLuggages || 0} large`}
        />
        <ReviewRow icon={Car} label="Vehicle Category" value={VEHICLE_LABELS[data.categoryId] || data.categoryId} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contact</p>
        <ReviewRow icon={Phone} label="Name" value={data.customerName} />
        <ReviewRow icon={Phone} label="Phone" value={data.customerPhone || "—"} />
        {data.notes && <ReviewRow icon={FileText} label="Additional Notes" value={data.notes} />}
      </div>

      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <p className="text-sm font-bold text-slate-700 mb-3">What happens after you submit?</p>
        {[
          "Your custom plan is submitted with status: PENDING",
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
};

const CustomSidePanel = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="space-y-4"
  >
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-2xl font-extrabold text-slate-800 mb-5">How It Works</h2>
      <div className="space-y-4">
        {[
          { title: "Submit Your Plan", desc: "Choose your cities, activities, and vehicle preferences." },
          { title: "Receive a Quote", desc: "We’ll review and send you a custom price." },
          { title: "Confirm & Travel", desc: "Accept the quote and enjoy your tailor-made tour." },
        ].map(({ title, desc }) => (
          <div key={title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-[#00b0a5] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {title.charAt(0)}
              </div>
              <div className="w-0.5 h-6 bg-slate-200 mt-1" />
            </div>
            <div className="pb-2">
              <p className="text-sm font-bold text-slate-800">{title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-[#00b0a5]/10 border border-[#00b0a5]/20 rounded-2xl p-6">
      <h3 className="font-extrabold text-slate-800 mb-1">Need Help Planning?</h3>
      <p className="text-sm text-slate-600 mb-3">
        Our travel experts can help shape your ideal Sri Lanka itinerary.
      </p>
      <a
        href="tel:+94778619582"
        className="flex items-center gap-2 text-[#00b0a5] font-semibold hover:text-[#009b91] transition-colors"
      >
        +94 77 861 9582
      </a>
    </div>

    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
      <p className="text-sm font-bold text-slate-700 mb-1">Booking Policy</p>
      <p className="text-xs text-slate-500 leading-relaxed">
        Customized tours are reviewed manually, and no payment is required until the quote is approved.
      </p>
    </div>
  </motion.div>
);

const Customized = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(initialData);
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
    if (!data.selectedCities.includes(selectedCity)) {
      handleChange("selectedCities", [...data.selectedCities, selectedCity]);
    }
    setSelectedCity("");
  };

  const handleRemoveCity = (city) => {
    handleChange(
      "selectedCities",
      data.selectedCities.filter((item) => item !== city)
    );
  };

  const handleAddActivity = () => {
    if (!selectedActivity) return;
    if (!data.activities.includes(selectedActivity)) {
      handleChange("activities", [...data.activities, selectedActivity]);
    }
    setSelectedActivity("");
  };

  const handleRemoveActivity = (activity) => {
    handleChange(
      "activities",
      data.activities.filter((item) => item !== activity)
    );
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
    if (validateStep(currentStep, data)) {
      setError("");
      setCurrentStep((s) => s + 1);
    } else {
      setError("Please complete all required fields before continuing.");
    }
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const result = await submitCustomBooking({
        ...data,
        customerEmail: user.email,
      });
      setBookingRef(result.bookingRef);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = validateStep(currentStep, data);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <BookingStepIndicator steps={STEPS} currentStep={currentStep} />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.25 }}
                    >
                      {currentStep === 0 && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-[#00b0a5]" /> Choose Your Stops
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                              Select one or more cities or places for your customized itinerary.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                  Add a city or destination
                                </label>
                                <div className="flex gap-2">
                                  <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] focus:ring-2 focus:ring-[#00b0a5]/20"
                                  >
                                    <option value="">Select a city</option>
                                    {PLACE_OPTIONS.map((place) => (
                                      <option key={place} value={place}>
                                        {place}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    onClick={handleAddCity}
                                    className="bg-[#00b0a5] text-white px-4 rounded-xl font-semibold hover:bg-[#009b91] transition-colors"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                  Choose activities
                                </label>
                                <div className="flex gap-2">
                                  <select
                                    value={selectedActivity}
                                    onChange={(e) => setSelectedActivity(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] focus:ring-2 focus:ring-[#00b0a5]/20"
                                  >
                                    <option value="">Select an activity</option>
                                    {ACTIVITY_OPTIONS.map((activity) => (
                                      <option key={activity} value={activity}>
                                        {activity}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    onClick={handleAddActivity}
                                    className="bg-[#00b0a5] text-white px-4 rounded-xl font-semibold hover:bg-[#009b91] transition-colors"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mt-5 space-y-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-700 mb-2">Selected Destinations</p>
                                <div className="flex flex-wrap gap-2">
                                  {data.selectedCities.length > 0 ? (
                                    data.selectedCities.map((city) => (
                                      <span key={city} className="inline-flex items-center gap-2 bg-[#00b0a5]/10 text-[#09483c] rounded-full px-3 py-2 text-sm">
                                        {city}
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveCity(city)}
                                          className="text-[#006d5f] font-bold"
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ))
                                  ) : (
                                    <p className="text-sm text-slate-500">No cities added yet.</p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-700 mb-2">Selected Activities</p>
                                <div className="flex flex-wrap gap-2">
                                  {data.activities.length > 0 ? (
                                    data.activities.map((activity) => (
                                      <span key={activity} className="inline-flex items-center gap-2 bg-[#00b0a5]/10 text-[#09483c] rounded-full px-3 py-2 text-sm">
                                        {activity}
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveActivity(activity)}
                                          className="text-[#006d5f] font-bold"
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ))
                                  ) : (
                                    <p className="text-sm text-slate-500">No activities selected yet.</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-[#00b0a5]" /> Travel Dates
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                              Add your desired start and end dates.
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
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] focus:ring-2 focus:ring-[#00b0a5]/20"
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
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] focus:ring-2 focus:ring-[#00b0a5]/20"
                                />
                              </div>
                            </div>
                            <div className="mt-4">
                              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                <Clock className="w-4 h-4" /> Preferred Pickup Time *
                              </label>
                              <input
                                type="time"
                                value={data.pickupTime}
                                onChange={(e) => handleChange("pickupTime", e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all focus:border-[#00b0a5] focus:ring-2 focus:ring-[#00b0a5]/20"
                              />
                            </div>

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
                      )}
                      {currentStep === 1 && <BookingPassengersStep data={data} onChange={handleChange} />}
                      {currentStep === 2 && <BookingNotesStep data={data} onChange={handleChange} />}
                      {currentStep === 3 && <CustomReviewStep data={data} />}
                    </motion.div>
                  </AnimatePresence>

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
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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
          <div className="lg:col-span-1">
            <CustomSidePanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customized;
