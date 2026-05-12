import React from "react";
import { X, MapPin, Users, Sparkles, Trash2 } from "lucide-react";

export default function LightboxModal({ p, onClose, onToggleStatus, onDelete }) {
  if (!p) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col md:flex-row border border-stone-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900/85 text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="md:w-1/2 bg-stone-950 flex flex-col justify-between relative max-h-[45vh] md:max-h-[90vh]">
          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />

          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center gap-1 text-[10px] px-3 py-1 rounded-full font-extrabold text-white shadow-sm ${
                p.status === "published" ? "bg-teal-500" : "bg-amber-500"
              }`}
            >
              {p.status === "published" ? "✓ LIVE IN GALLERY" : "📝 WORK IN PROGRESS"}
            </span>
          </div>

          {p.withTourists && (
            <div className="absolute top-4 left-[140px]">
              <span className="inline-flex items-center gap-1 text-[10px] px-3 py-1 rounded-full font-bold bg-purple-600 text-white shadow-sm">
                <Users className="w-3 h-3" /> OUR CUSTOMERS
              </span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 bg-stone-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-stone-800">
            <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              {p.loc}
            </p>
            <p className="text-sm font-extrabold text-stone-100">{p.title}</p>
          </div>
        </div>

        <div className="md:w-1/2 p-6 overflow-y-auto max-h-[45vh] md:max-h-[90vh] flex flex-col justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-stone-200">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                {p.tourist ? p.tourist.charAt(0) : "T"}
              </div>
              <div>
                <p className="text-xs font-extrabold text-stone-800">{p.tourist || "Independent Traveler"}</p>
                <p className="text-[10px] text-stone-400 font-semibold">
                  {p.date ? `Date Taken: ${p.date}` : "Date logged in 2026"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {p.event && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <p className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 text-amber-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    Linked Festival Event
                  </p>
                  <p className="text-xs font-bold mt-1 text-amber-950 break-all">{p.event}</p>
                </div>
              )}

              <div>
                <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block mb-1">
                  Traveler Story & Review
                </span>
                <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-200/60 shadow-inner break-all whitespace-pre-wrap">
                  {p.desc ||
                    "We embarked on this gorgeous tour around beautiful Ceylon. Highly recommended driver service with smooth cruising and high guide availability."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                  <span className="text-[9px] font-bold text-stone-400 block mb-0.5">Season Theme</span>
                  <p className="text-xs font-bold capitalize">
                    {p.season === "dry"
                      ? "☀️ Dry Season"
                      : p.season === "swmonsoon"
                      ? "🌧 SW Monsoon"
                      : p.season === "inter1"
                      ? "🌤 Inter-monsoon"
                      : "🌦 NE Monsoon"}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                  <span className="text-[9px] font-bold text-stone-400 block mb-0.5">Vibe Mood</span>
                  <p className="text-xs font-bold capitalize">{p.mood ? `🧭 ${p.mood}` : "🏔 Scenic"}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block mb-1.5">Search Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags?.map((t, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-stone-200/60 text-stone-600">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-stone-200 flex items-center justify-between gap-3">
            <button
              onClick={(e) => {
                onDelete(p.id, e);
                onClose();
              }}
              className="px-3.5 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Remove Photo
            </button>

            <button
              onClick={(e) => {
                onToggleStatus(p, e);
                onClose();
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                p.status === "published"
                  ? "bg-stone-200 hover:bg-stone-300 text-stone-700"
                  : "bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-950/20"
              }`}
            >
              {p.status === "published" ? "Demote to Drafts" : "✓ Approve & Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}