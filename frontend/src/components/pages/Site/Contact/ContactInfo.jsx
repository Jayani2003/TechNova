import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";

const TripadvisorIcon = ({ size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M12 4.5c-1.35 0-2.6.36-3.66.98L6.56 4.2 5.3 5.44l1.48 1.48A6.98 6.98 0 0 0 4 12c0 3.87 3.13 7 7 7s7-3.13 7-7c0-1.67-.58-3.2-1.54-4.4l1.44-1.44-1.26-1.25-1.76 1.76A6.97 6.97 0 0 0 12 4.5Zm-3.5 5.1a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8Zm7 0a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8Zm-3.5-.9c.83 0 1.6.23 2.26.63l.88-.88.9.9-.87.87c.4.67.63 1.44.63 2.27 0 2.48-2.02 4.5-4.5 4.5s-4.5-2.02-4.5-4.5 2.02-4.5 4.5-4.5Zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z" />
  </svg>
);

const InfoItem = ({ href, target, icon, title, lines, delay }) => (
  <motion.a
    href={href}
    target={target}
    rel={target === "_blank" ? "noopener noreferrer" : undefined}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-start gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors"
  >
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#00b0a520" }}>
      <span style={{ color: "#00b0a5" }}>{icon}</span>
    </div>
    <div>
      <p className="font-bold text-slate-800 text-sm tracking-tight">{title}</p>
      {lines.map((line, i) => (
        <p key={i} className="text-sm text-slate-500 mt-0.5">{line}</p>
      ))}
    </div>
  </motion.a>
);

const ContactInfo = () => (
  <div className="space-y-4">
    {/* ── Get In Touch Card ── */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-2"
    >
      <div className="mb-4">
        <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-widest text-white uppercase rounded-full" style={{ backgroundColor: "#00b0a5" }}>
          Contact
        </span>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Get in Touch</h2>
      </div>

      <InfoItem
        href="https://share.google/xOzAOaynrrGNRAfcD"
        target="_blank"
        icon={<MapPin className="w-5 h-5" />}
        title="Our Location"
        lines={["No.214, Kirinda Hospital Road,", "Kirinda, Tissamaharama, Sri Lanka."]}
        delay={0.1}
      />
      <InfoItem
        href="tel:+94778619582"
        icon={<Phone className="w-5 h-5" />}
        title="Phone"
        lines={["+94 77 861 9582"]}
        delay={0.2}
      />
      <InfoItem
        href="https://wa.me/94778619582?text=Hello%20Ceylon%20Best%20Tours%2C%20I%20would%20like%20to%20inquire%20about%20your%20services"
        target="_blank"
        icon={<MessageCircle className="w-5 h-5" />}
        title="WhatsApp"
        lines={["+94 77 861 9582"]}
        delay={0.3}
      />
      <InfoItem
        href="mailto:ceylonbesttours05@gmail.com"
        icon={<Mail className="w-5 h-5" />}
        title="Email"
        lines={["ceylonbesttours05@gmail.com"]}
        delay={0.4}
      />
      <InfoItem
        icon={<Clock className="w-5 h-5" />}
        title="Business Hours"
        lines={["24/7 Monday - Sunday"]}
        delay={0.5}
      />
    </motion.div>

    {/* ── Emergency Assistance Card ── */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border p-6"
      style={{ backgroundColor: "#00b0a510", borderColor: "#00b0a530" }}
    >
      <h3 className="font-extrabold text-slate-800 tracking-tight mb-1">Emergency Assistance</h3>
      <p className="text-sm text-slate-600 mb-3">24/7 roadside assistance for all our customers.</p>
      <a
        href="tel:+94778619582"
        className="flex items-center gap-2 font-semibold transition-colors"
        style={{ color: "#00b0a5" }}
        onMouseEnter={e => e.currentTarget.style.color = "#009a90"}
        onMouseLeave={e => e.currentTarget.style.color = "#00b0a5"}
      >
        <Phone className="w-5 h-5" />
        +94 77 861 9582
      </a>
    </motion.div>

    {/* ── Follow Us Card ── */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
    >
      <h3 className="font-extrabold text-slate-800 tracking-tight mb-4">Follow Us</h3>
      <div className="flex gap-3">
        <a
          href="https://www.facebook.com/ceylonbesttours"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Facebook"
          className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          <Facebook className="w-5 h-5" />
        </a>
        <a
          href="https://www.instagram.com/ceylon_best_tours?igsh=MXRiMW5iM3R4M3hvdQ=="
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Instagram"
          className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
        >
          <Instagram className="w-5 h-5" />
        </a>
        <a
          href="https://www.tripadvisor.com/Attraction_Review-g1102395-d16926335-Reviews-Ceylon_Best_Tours_Taxi_Service-Tissamaharama_Southern_Province.html"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Find us on TripAdvisor"
          className="w-10 h-10 text-white rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: "#00b0a5" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#009a90"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#00b0a5"}
        >
          <TripadvisorIcon size={20} />
        </a>
      </div>
    </motion.div>
  </div>
);

export default ContactInfo;
