import { MapPin, ExternalLink } from "lucide-react";
 
const MAPS_URL = "https://share.google/SJnuuanvPhICCZe92";
 
const ContactMap = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mt-8 overflow-hidden">
    {/* Header */}
    <div className="px-6 py-4 flex items-center gap-2 border-b border-slate-100">
      <MapPin className="w-5 h-5 text-slate-500" />
      <h2 className="font-bold text-slate-800">Our Location</h2>
    </div>

    <a
      href={MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative h-80 w-full bg-slate-100 hover:bg-slate-200 transition-colors group"
    >
      {/* Grid lines to mimic a map feel */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
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
 
      {/* Center pin */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <MapPin className="w-7 h-7 text-white" />
        </div>
        <div className="bg-white rounded-xl px-5 py-2 shadow-md flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">
            No.214, Kirinda Hospital Road, Kirinda
          </span>
          <ExternalLink className="w-4 h-4 text-blue-500" />
        </div>
        <p className="text-xs text-slate-400">Click to open in Google Maps</p>
      </div>
    </a>
 
    {/* Footer */}
    <div className="px-6 py-4 bg-slate-50 flex items-start justify-between">
      <div>
        <p className="font-semibold text-slate-800 text-sm">
          Ceylon Best Tours
        </p>
        <p className="text-sm text-slate-500 mt-0.5">
          No.214, Kirinda Hospital Road, Kirinda, Tissamaharama, Sri Lanka.
        </p>
      </div>
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium flex-shrink-0"
      >
        <MapPin className="w-4 h-4" />
        View Larger Map
      </a>
    </div>
  </div>
);
 
export default ContactMap;