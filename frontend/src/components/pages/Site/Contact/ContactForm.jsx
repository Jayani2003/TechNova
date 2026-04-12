import { useState, useContext } from "react";
import { Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router";

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ user, navigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center"
  >
    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "#00b0a520" }}>
      <CheckCircle className="w-10 h-10" style={{ color: "#00b0a5" }} />
    </div>
    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-3">
      Message Sent Successfully!
    </h2>
    <p className="text-slate-500 text-sm mb-8">
      Thank you for contacting Ceylon Best Tours. We've received your message and
      will respond within 6 hours.{" "}
      {user ? "You can check replies in your dashboard." : "We'll send our response to your email."}
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <button
        onClick={() => navigate("/")}
        className="text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        style={{ backgroundColor: "#00b0a5" }}
        onMouseEnter={e => e.target.style.backgroundColor = "#009a90"}
        onMouseLeave={e => e.target.style.backgroundColor = "#00b0a5"}
      >
        Return to Home
      </button>
      {user && (
        <button
          onClick={() => navigate("/user/dashboard")}
          className="border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
        >
          View Inbox
        </button>
      )}
    </div>
  </motion.div>
);

// ─── Contact Form ─────────────────────────────────────────────────────────────
const ContactForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to backend or MessagesContext later
    setSubmitted(true);
  };

  if (submitted) return <SuccessScreen user={user} navigate={navigate} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
    >
      <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2 mb-6">
        <Send className="w-5 h-5" style={{ color: "#00b0a5" }} />
        Send Us a Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Name + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-xl border border-slate-200 bg-white outline-none text-sm text-slate-800 transition-all"
              style={{ "--tw-ring-color": "#00b0a5" }}
              onFocus={e => e.target.style.borderColor = "#00b0a5"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address *</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-xl border border-slate-200 bg-white outline-none text-sm text-slate-800 transition-all"
              onFocus={e => e.target.style.borderColor = "#00b0a5"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
        </div>

        {/* Row 2: Phone + Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Phone Number</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white outline-none text-sm text-slate-800 transition-all"
              onFocus={e => e.target.style.borderColor = "#00b0a5"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Subject *</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-xl border border-slate-200 bg-white outline-none text-sm text-slate-600 transition-all"
              onFocus={e => e.target.style.borderColor = "#00b0a5"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            >
              <option value="" disabled>Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="booking">Booking Question</option>
              <option value="vehicle">Vehicle Rental</option>
              <option value="tour">Tour Package</option>
              <option value="feedback">Feedback</option>
              <option value="support">Support</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={6}
            placeholder="Tell us how we can help you..."
            required
            className="w-full p-3 rounded-xl border border-slate-200 bg-white outline-none text-sm text-slate-800 resize-none transition-all"
            onFocus={e => e.target.style.borderColor = "#00b0a5"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>

        <button
          type="submit"
          className="w-full text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 tracking-wide"
          style={{ backgroundColor: "#00b0a5" }}
          onMouseEnter={e => e.target.style.backgroundColor = "#009a90"}
          onMouseLeave={e => e.target.style.backgroundColor = "#00b0a5"}
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
