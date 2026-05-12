import React, { useState } from "react";
import { Search, X, Grid, List, MapPin, User, Users, Eye, Trash2 } from "lucide-react";
import { SEASONS, MOODS } from "./constants";

export default function GalleryTab({ photos, setPhotos, onToast, onViewPhoto }) {
  const [filter, setFilter] = useState("all");
  const [moodFilter, setMoodFilter] = useState("all");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [search, setSearch] = useState(" ");
  const [viewMode, setViewMode] = useState("grid");

  const filtered = photos.filter((p) => {
    let matchStatus = true;
    if (filter === "published" || filter === "draft") {
      matchStatus = p.status === filter;
    } else if (filter === "customers") {
      matchStatus = p.withTourists;
    }

    const matchMood = moodFilter === "all" || p.mood === moodFilter;
    const matchSeason = seasonFilter === "all" || p.season === seasonFilter;

    const sTerm = search.trim().toLowerCase();
    const matchSearch =
      !sTerm ||
      p.title.toLowerCase().includes(sTerm) ||
      p.loc.toLowerCase().includes(sTerm) ||
      (p.desc && p.desc.toLowerCase().includes(sTerm)) ||
      (p.tourist && p.tourist.toLowerCase().includes(sTerm)) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(sTerm))) ||
      (p.event && p.event.toLowerCase().includes(sTerm));

    return matchStatus && matchMood && matchSeason && matchSearch;
  });

  const deletePhoto = (id, e) => {
    e.stopPropagation();
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    onToast("Photo removed from database successfully.");
  };

  const toggleStatus = (p, e) => {
    e.stopPropagation();
    const nextStatus = p.status === "published" ? "draft" : "published";
    setPhotos((prev) => prev.map((item) => (item.id === p.id ? { ...item, status: nextStatus } : item)));
    onToast(`"${p.title}" status changed to ${nextStatus.toUpperCase()}`);
  };

  return (
    <div>
      <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex p-1 rounded-xl bg-stone-100 border border-stone-200 w-fit flex-wrap gap-1">
            {[
              { key: "all", label: "All Photos", count: photos.length },
              { key: "published", label: "✓ Published", count: photos.filter((p) => p.status === "published").length },
              { key: "draft", label: "Drafts", count: photos.filter((p) => p.status === "draft").length },
              { key: "customers", label: "Our Customers", count: photos.filter((p) => p.withTourists).length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className="px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                style={{
                  background: filter === tab.key ? "#fff" : "transparent",
                  color: filter === tab.key ? "#1A1714" : "#6B6560",
                  boxShadow: filter === tab.key ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                }}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    filter === tab.key ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-500 font-semibold self-end md:self-auto">
            <span>Grid Display Mode</span>
            <div className="flex border border-stone-200 rounded-lg p-0.5 bg-stone-50">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded cursor-pointer ${viewMode === "grid" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded cursor-pointer ${viewMode === "list" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-stone-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-stone-50 border border-stone-200 outline-none focus:border-teal-600 focus:bg-white text-stone-800 font-medium"
              placeholder="Search by keyword, tag, client..."
            />
          </div>

          <div className="relative">
            <select
              value={moodFilter}
              onChange={(e) => setMoodFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 border border-stone-200 outline-none focus:border-teal-600 focus:bg-white text-stone-800 font-medium appearance-none\"
            >
              <option value="all">All Mood Vibes</option>
              {MOODS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.icon} {m.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-400 text-xs">▼</div>
          </div>

          <div className="relative">
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 border border-stone-200 outline-none focus:border-teal-600 focus:bg-white text-stone-800 font-medium appearance-none"
            >
              <option value="all">All Seasons</option>
              {SEASONS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.icon} {s.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-400 text-xs">▼</div>
          </div>

          {(search.trim() || moodFilter !== "all" || seasonFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setMoodFilter("all");
                setSeasonFilter("all");
              }}
              className="px-4 py-2 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Clear Active Filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center text-4xl mx-auto mb-4 text-stone-400">
            📭
          </div>
          <h3 className="text-sm font-bold text-stone-800 mb-1">No matching tour photos found</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
            Try adjusting your search criteria, clear existing filters, or upload a brand-new Sri Lanka traveler highlight.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => {
            const seasonDetails = SEASONS.find((s) => s.key === p.season);
            const moodDetails = MOODS.find((m) => m.key === p.mood);
            return (
              <div
                key={p.id}
                onClick={() => onViewPhoto(p)}
                className="group rounded-2xl overflow-hidden bg-white border border-stone-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                  {p.event && (
                    <div className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FAF9F6]/95 text-amber-900 border border-amber-200 shadow-sm">
                      {p.event}
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] px-2.5 py-0.5 rounded-full font-extrabold shadow-sm ${
                        p.status === "published" ? "bg-teal-500 text-white" : "bg-amber-500 text-white"
                      }`}
                    >
                      {p.status === "published" ? "✓ PUBLISHED" : "📝 DRAFT"}
                    </span>
                  </div>

                  {p.withTourists && (
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-bold bg-purple-600 text-white shadow-sm">
                        <Users className="w-3 h-3" /> OUR CUSTOMERS
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="bg-white text-stone-900 font-bold text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 scale-95 group-hover:scale-100 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-teal-700" />
                      View Tour Details
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#C49A3C] mb-1.5 uppercase tracking-wider">
                      <MapPin className="w-3 h-3 text-[#C49A3C]" />
                      <span>{p.loc}</span>
                    </div>
                    <h3 className="text-xs font-extrabold text-stone-900 line-clamp-1 mb-2 group-hover:text-[#00b0a5] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1 break-all mb-3">
                      {p.desc || "A marvelous expedition highlight around beautiful Sri Lanka."}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {p.tags?.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded-md font-bold bg-stone-100 text-stone-600">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-1 text-[10px] text-stone-400 font-semibold">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span className="truncate max-w-[85px]">{p.tourist}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold">
                        <span>{seasonDetails?.icon}</span>
                        <span>{moodDetails?.icon}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-stone-150 justify-between items-center">
                      <button
                        onClick={(e) => toggleStatus(p, e)}
                        className={`text-[10px] font-extrabold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                          p.status === "published"
                            ? "bg-stone-100 hover:bg-stone-200 text-stone-600"
                            : "bg-teal-50 hover:bg-teal-100 text-teal-800"
                        }`}
                      >
                        {p.status === "published" ? "Demote to Draft" : "Go Live"}
                      </button>
                      <button
                        onClick={(e) => deletePhoto(p.id, e)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p) => {
            const seasonDetails = SEASONS.find((s) => s.key === p.season);
            const moodDetails = MOODS.find((m) => m.key === p.mood);
            return (
              <div
                key={p.id}
                onClick={() => onViewPhoto(p)}
                className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200 hover:border-teal-600 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="w-full md:w-24 h-20 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1">
                    <span
                      className={`text-[8px] px-1.5 py-0.2 rounded-full font-bold text-white shadow-sm ${
                        p.status === "published" ? "bg-teal-500" : "bg-amber-500"
                      }`}
                    >
                      {p.status === "published" ? "✓ LIVE" : "DRAFT"}
                    </span>
                  </div>
                  {p.withTourists && (
                    <div className="absolute bottom-1 left-1">
                      <span className="text-[8px] px-1.5 py-0.2 rounded-full font-bold bg-purple-600 text-white">CUSTOMER</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wide bg-teal-50 px-2 py-0.5 rounded-md">
                      📍 {p.loc}
                    </span>
                    {p.event && (
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">{p.event}</span>
                    )}
                  </div>
                  <h3 className="text-xs font-extrabold text-stone-900 truncate group-hover:text-[#00b0a5]">{p.title}</h3>
                  <p className="text-[11px] text-stone-500 line-clamp-1 break-all mt-0.5">
                    {p.desc || "Wonderful travel report from Ceylon guides."}
                  </p>
                </div>

                <div className="flex md:flex-col items-start md:items-end gap-2 text-right">
                  <span className="text-[10px] font-bold text-stone-400">Traveler: {p.tourist}</span>
                  <div className="flex gap-2">
                    <span className="text-xs" title="Season">
                      {seasonDetails?.icon} {seasonDetails?.label}
                    </span>
                    <span className="text-xs" title="Mood">
                      {moodDetails?.icon} {moodDetails?.label}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 items-center border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                  <button
                    onClick={(e) => toggleStatus(p, e)}
                    className="text-[10px] font-bold border border-stone-200 hover:border-teal-700 hover:bg-teal-50 hover:text-teal-800 rounded-lg px-3 py-1.5 text-stone-600 transition-all cursor-pointer"
                  >
                    {p.status === "published" ? "Make Draft" : "Make Live"}
                  </button>
                  <button
                    onClick={(e) => deletePhoto(p.id, e)}
                    className="p-1.5 rounded-lg border border-red-150 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}