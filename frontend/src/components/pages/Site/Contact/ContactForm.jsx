import { useState, useContext } from "react";
import { Send, CheckCircle } from "lucide-react";
import { AuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router";

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ user, navigate }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle className="w-10 h-10 text-emerald-600" />
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mb-3">
      Message Sent Successfully!
    </h2>
    <p className="text-slate-500 text-sm mb-6">
      Thank you for contacting Ceylon Best Tours. We've received your message and
      will respond within 6 hours.{" "}
      {user
        ? "You can check replies in your dashboard."
        : "We'll send our response to your email."}
    </p>

    {/* <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-3">
      <p className="font-semibold text-slate-700 text-sm">What happens next?</p>
      {[
        "Our team will review your message",
        "You'll receive a response within 6 hours",
        user
          ? "Check your dashboard inbox for replies"
          : "We'll email you our response",
      ].map((step, i) => (
        <div key={i} className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
          <span className="text-sm text-slate-600">{step}</span>
        </div>
      ))}
    </div> */}

    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <button
        onClick={() => navigate("/")}
        className="!bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Return to Home
      </button>
      {user && (
        <button
          onClick={() => navigate("/user/dashboard")}
          className="!border !bg-blue-600 !text-blue-100 px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          View Inbox
        </button>
      )}
    </div>
  </div>
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
    // addMessage({
    //   customerId: user?.id || `guest${Date.now()}`,
    //   customerName: formData.name,
    //   customerEmail: formData.email,
    //   customerPhone: formData.phone,
    //   subject: formData.subject,
    //   message: formData.message,
    // });
    setSubmitted(true);
  };

  if (submitted) return <SuccessScreen user={user} navigate={navigate} />;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
        <Send className="w-5 h-5 text-slate-500" />
        Send us a meesage
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Name + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Row 2: Phone + Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subject *
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-600 outline-none text-sm text-slate-600"
            >
              <option value="" disabled>
                Select a subject
              </option>
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
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={6}
            placeholder="Tell us how we can help you..."
            required
            className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm resize-none text-slate-800"
          />
        </div>

        <button
          type="submit"
          className="w-full !bg-blue-600 text-blue-100 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
