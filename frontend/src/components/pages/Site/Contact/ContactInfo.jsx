import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { FaTripadvisor } from "react-icons/fa";

const ContactInfo = () => (
  <div className="space-y-4">
    {/* ── Get In Touch Card ── */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Get in touch</h2>

      {/* Location */}
      <a
        href="https://share.google/xOzAOaynrrGNRAfcD"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors"
      >
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">Our location</p>
          <p className="text-sm text-slate-500 mt-0.5">
            No.214, Kirinda Hospital Road,
            <br />
            Kirinda, Tissamaharama, Sri Lanka.
          </p>
        </div>
      </a>

      {/* Phone */}
      <a
        href="tel:+94112345678"
        className="flex items-start gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors"
      >
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Phone className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">Phone</p>
          <p className="text-sm text-slate-500 mt-0.5">+94 77 861 9582</p>
        </div>
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/94778619582?text=Hello%20Ceylon%20Best%20Tours%2C%20I%20would%20like%20to%20inquire%20about%20your%20services"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors"
      >
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 text-green-600" />
        </div>
        <div>
          {/* <p className="text-sm text-slate-500 mt-2">
            WhatsApp: +94 77 861 9582
          </p> */}
          <p className="font-semibold text-slate-800 text-sm">WhatsApp</p>
          <p className="text-sm text-slate-500 mt-0.5">+94 77 861 9582</p>
        </div>
      </a>

      {/* Email */}
      <div className="flex items-start gap-3 p-2">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">Email</p>
          <a
            href="mailto:info@lankawheels.com"
            className="text-sm text-slate-500 hover:text-blue-600 transition-colors block mt-0.5"
          >
            ceylonbesttours05@gmail.com
          </a>
          {/* <a
            href="mailto:bookings@lankawheels.com"
            className="text-sm text-slate-500 hover:text-blue-600 transition-colors block"
          >
            Bookings: bookings@lankawheels.com
          </a> */}
        </div>
      </div>

      {/* Business Hours */}
      <div className="flex items-start gap-3 p-2">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">Business hours</p>
          <p className="text-sm text-slate-500 mt-0.5">
            24/7 Monday - Sunday
          </p>
        </div>
      </div>
    </div>

    {/* ── Emergency Assistance Card ── */}
    <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
      <h3 className="font-bold text-slate-800 mb-1">Emergency Assistance</h3>
      <p className="text-sm text-slate-600 mb-3">
        24/7 roadside assistance for all our customers.
      </p>
      <a
        href="tel:+94779998888"
        className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
      >
        <Phone className="w-5 h-5" />
        +94 77 861 9582
      </a>
    </div>

    {/* ── Follow Us Card ── */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="font-bold text-slate-800 mb-3">Follow us</h3>
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
          className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
        >
          <FaTripadvisor className="w-5 h-5" />
        </a>
      </div>
    </div>
  </div>
);

export default ContactInfo;
