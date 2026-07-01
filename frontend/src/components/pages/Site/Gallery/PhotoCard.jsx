import { MapPin, Calendar, User, ArrowUpRight } from "lucide-react";
import { SEASONS, MOODS } from "../../../data/tourData";
import { useTranslation } from "react-i18next";

export default function PhotoCard({ photo, onClick, variant = "default" }) {
  const { t } = useTranslation();
  const season = SEASONS.find((s) => s.key === photo.season);
  const mood = MOODS.find((m) => m.key === photo.mood);

  if (variant === "featured") {
    return (
      <div
        onClick={onClick}
        className="group relative rounded-3xl overflow-hidden cursor-pointer h-[500px] col-span-2 row-span-2"
      >
        {/* Image */}
        <img
          src={photo.image}
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white">
              {t("gallery.card.featured")}
            </span>
            {photo.event && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-white">
                {photo.event}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider">
              {photo.loc}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-3xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {photo.title}
          </h3>

          {/* Description */}
          <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
            {photo.desc}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{photo.tourist}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>{season?.icon}</span>
                <span>{season?.label}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-500 group-hover:scale-110 transition-all">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white shadow-lg shadow-stone-200/50 hover:shadow-xl hover:shadow-stone-300/50 transition-all duration-500 hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={photo.image}
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {photo.withTourists && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500 text-white shadow-lg">
              {t("gallery.filters.ourCustomers")}
            </span>
          )}
          {photo.event && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-stone-800 shadow-lg">
              {photo.event}
            </span>
          )}
        </div>

        {/* Mood & Season Icons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-sm">
            {mood?.icon}
          </span>
          <span className="w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-sm">
            {season?.icon}
          </span>
        </div>

        {/* View button on hover */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location Tag */}
        <div className="flex items-center gap-1.5 text-emerald-600 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {photo.loc}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1">
          {photo.title}
        </h3>

        {/* Description */}
        <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {photo.desc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {photo.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="flex items-center gap-2 text-stone-500 text-xs">
            <User className="w-3.5 h-3.5" />
            <span className="font-medium truncate max-w-[120px]">
              {photo.tourist}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-400 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{photo.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
