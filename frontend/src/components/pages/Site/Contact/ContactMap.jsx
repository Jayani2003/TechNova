import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";

const MAPS_URL = "https://share.google/SJnuuanvPhICCZe92";

const ContactMap = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="bg-white rounded-2xl border border-slate-100 shadow-sm mt-8 overflow-hidden"
  >
    {/* Header */}
    <div className="px-6 py-4 flex items-center gap-2 border-b border-slate-100">
      <MapPin className="w-5 h-5" style={{ color: "#00b0a5" }} />
      <h2 className="font-extrabold text-slate-800 tracking-tight">Our Location</h2>
    </div>

    {/* Map placeholder */}
    <a
      href={MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative h-80 w-full bg-slate-100 hover:bg-slate-200 transition-colors group"
    >
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Road lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#94a3b8" strokeWidth="6" />
        <line x1="35%" y1="0" x2="35%" y2="100%" stroke="#94a3b8" strokeWidth="4" />
        <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#94a3b8" strokeWidth="3" />
        <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#94a3b8" strokeWidth="3" />
        <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#94a3b8" strokeWidth="3" />
      </svg>

      {/* Pin */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
          style={{ backgroundColor: "#00b0a5" }}
        >
          <MapPin className="w-7 h-7 text-white" />
        </div>
        <div className="bg-white rounded-xl px-5 py-2 shadow-md flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">
            No.214, Kirinda Hospital Road, Kirinda
          </span>
          <ExternalLink className="w-4 h-4" style={{ color: "#00b0a5" }} />
        </div>
        <p className="text-xs text-slate-400 tracking-wide">Click to open in Google Maps</p>
      </div>
    </a>

    {/* Footer */}
    <div className="px-6 py-4 bg-slate-50 flex items-start justify-between">
      <div>
        <p className="font-extrabold text-slate-800 text-sm tracking-tight">Ceylon Best Tours</p>
        <p className="text-sm text-slate-500 mt-0.5">
          No.214, Kirinda Hospital Road, Kirinda, Tissamaharama, Sri Lanka.
        </p>
      </div>
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm font-semibold flex-shrink-0 transition-colors"
        style={{ color: "#00b0a5" }}
        onMouseEnter={e => e.currentTarget.style.color = "#009a90"}
        onMouseLeave={e => e.currentTarget.style.color = "#00b0a5"}
      >
        <MapPin className="w-4 h-4" />
        View Larger Map
      </a>
    </div>
  </motion.div>
);

export default ContactMap;
