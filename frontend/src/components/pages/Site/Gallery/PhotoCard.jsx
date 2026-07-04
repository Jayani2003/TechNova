import { MapPin, Calendar, User, ArrowUpRight } from "lucide-react";
import { SEASONS, MOODS } from "../../../data/tourData";
import { motion } from "framer-motion";

export default function PhotoCard({ photo, onClick, index = 0 }) {
  
  const season = SEASONS.find((s) => s.key === photo.season);
  const mood = MOODS.find((m) => m.key === photo.mood);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer mb-6 break-inside-avoid shadow-lg shadow-stone-200/50 bg-stone-900"
    >
      {/* Image Container - Let it take natural height */}
      <div className="relative w-full">
        <img
          src={photo.image}
          alt={photo.title}
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Gradient Overlay always slightly visible at bottom for text, darker on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
          {photo.withTourists && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/90 backdrop-blur-md text-white shadow-lg w-fit">
              {"Our Customers"}
            </span>
          )}
          {photo.event && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-stone-800 shadow-lg w-fit">
              {photo.event}
            </span>
          )}
        </div>

        {/* Mood & Season Icons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white shadow-lg flex items-center justify-center text-sm border border-white/20">
            {mood?.icon}
          </span>
          <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white shadow-lg flex items-center justify-center text-sm border border-white/20">
            {season?.icon}
          </span>
        </div>


        {/* Content Section Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          {/* Location Tag */}
          <div className="flex items-center gap-1.5 text-emerald-400 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {photo.loc}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {photo.title}
          </h3>

          {/* Hidden on default, expands on hover */}
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
            <div className="overflow-hidden">
              <p className="text-white/70 text-xs leading-relaxed line-clamp-3 mb-4 mt-2">
                {photo.desc}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {photo.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/10 backdrop-blur-sm text-white/90 border border-white/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-medium truncate max-w-[120px]">
                    {photo.tourist}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-white/60 text-[10px]">
                  <Calendar className="w-3 h-3" />
                  <span>{photo.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
