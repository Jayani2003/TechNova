import { useEffect, useState } from "react";
import { Search, Filter, X, ChevronDown, Camera, Sparkles } from "lucide-react";
import { SEASONS, MOODS } from "../../../data/tourData";
import { fetchGalleryPhotos } from "../../../../services/galleryService";
import PhotoCard from "./PhotoCard";
import FooterCTA from "./FooterCTA";
import { motion } from "framer-motion";
import galleryBg from "../../../../assets/mirissa.jpg";

export default function Gallery({ photos, onPhotoClick = () => { } }) {
  
  const [search, setSearch] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedMood, setSelectedMood] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showCustomerPhotos, setShowCustomerPhotos] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState(Array.isArray(photos) ? photos : []);
  const [loading, setLoading] = useState(!Array.isArray(photos));
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (Array.isArray(photos)) {
      setGalleryPhotos(photos);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadGallery = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const items = await fetchGalleryPhotos();
        if (!cancelled) {
          setGalleryPhotos(items);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.message || "Unable to load gallery from the server.");
          setGalleryPhotos([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadGallery();

    return () => {
      cancelled = true;
    };
  }, [photos]);

  // Filter photos (only published)
  const filteredPhotos = galleryPhotos
    .filter((p) => p.status === "published")
    .filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.loc.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        (p.tourist && p.tourist.toLowerCase().includes(search.toLowerCase()));

      const matchSeason = selectedSeason === "all" || p.season === selectedSeason;
      const matchMood = selectedMood === "all" || p.mood === selectedMood;
      const matchLocation = selectedLocation === "all" || p.loc === selectedLocation;
      const matchCustomer = !showCustomerPhotos || p.withTourists;

      return matchSearch && matchSeason && matchMood && matchLocation && matchCustomer;
    });

  const clearFilters = () => {
    setSearch("");
    setSelectedSeason("all");
    setSelectedMood("all");
    setSelectedLocation("all");
    setShowCustomerPhotos(false);
  };

  const hasActiveFilters =
    search || selectedSeason !== "all" || selectedMood !== "all" || selectedLocation !== "all" || showCustomerPhotos;

  const uniqueLocations = [...new Set(galleryPhotos.map((p) => p.loc))];

  return (
    <div className="min-h-screen bg-[#00b0a5]/5 pb-16">
      {/* Hero Header */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          src={galleryBg}
          className="absolute w-full h-full object-cover"
          alt="Sri Lanka gallery background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-xs font-semibold tracking-widest text-white uppercase bg-[#00b0a5] rounded-full">
              <Camera className="w-3.5 h-3.5" />
              {"Traveler's Gallery"}
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {"A Glimpse into Paradise."}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light">
              {"Real stories and moments captured by our travelers across the beautiful landscapes of Sri Lanka."}
            </p>
          </motion.div>
        </div>
      </section>

      <section id="gallery" className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg shadow-stone-200/50 p-4 lg:p-6 mb-10">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={"Search memories, locations, or tags..."}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-stone-800 transition-all"
                />
              </div>

              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-100 text-stone-700 font-semibold cursor-pointer"
              >
                <Filter className="w-4 h-4" />
                {"Filters"}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Season Filter */}
                <div className="relative">
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:border-emerald-500 text-stone-700 font-medium cursor-pointer min-w-[160px]"
                  >
                    <option value="all">{"All Seasons"}</option>
                    {SEASONS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.icon} {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>

                {/* Mood Filter */}
                <div className="relative">
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:border-emerald-500 text-stone-700 font-medium cursor-pointer min-w-[150px]"
                  >
                    <option value="all">{"All Vibes"}</option>
                    {MOODS.map((m) => (
                      <option key={m.key} value={m.key}>
                        {m.icon} {m.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>

                {/* Location Filter */}
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:border-emerald-500 text-stone-700 font-medium cursor-pointer min-w-[150px]"
                  >
                    <option value="all">{"All Locations"}</option>
                    {uniqueLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>

                {/* Customer Photos Toggle */}
                <button
                  onClick={() => setShowCustomerPhotos(!showCustomerPhotos)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${showCustomerPhotos
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
                    }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {"Our Customers"}
                </button>
              </div>
            </div>

            {/* Mobile Filters Dropdown */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t border-stone-100 grid grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="w-full appearance-none px-3 py-2.5 pr-8 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-700 font-medium"
                  >
                    <option value="all">{"All Seasons"}</option>
                    {SEASONS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.icon} {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="w-full appearance-none px-3 py-2.5 pr-8 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-700 font-medium"
                  >
                    <option value="all">{"All Vibes"}</option>
                    {MOODS.map((m) => (
                      <option key={m.key} value={m.key}>
                        {m.icon} {m.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full appearance-none px-3 py-2.5 pr-8 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-700 font-medium"
                  >
                    <option value="all">{"All Locations"}</option>
                    {uniqueLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>

                <button
                  onClick={() => setShowCustomerPhotos(!showCustomerPhotos)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${showCustomerPhotos
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-stone-50 text-stone-600 border border-stone-200"
                    }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {"Customers"}
                </button>
              </div>
            )}

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-stone-100">
                <span className="text-xs font-semibold text-stone-500">{"Active Filters:"}</span>
                {search && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    "{search}"
                    <button onClick={() => setSearch("")} className="hover:text-emerald-900 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSeason !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                    {SEASONS.find((s) => s.key === selectedSeason)?.label}
                    <button onClick={() => setSelectedSeason("all")} className="hover:text-amber-900 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedMood !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {MOODS.find((m) => m.key === selectedMood)?.label}
                    <button onClick={() => setSelectedMood("all")} className="hover:text-blue-900 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedLocation !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    {selectedLocation}
                    <button onClick={() => setSelectedLocation("all")} className="hover:text-green-900 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {showCustomerPhotos && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                    {"Our Customers"}
                    <button onClick={() => setShowCustomerPhotos(false)} className="hover:text-purple-900 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer ml-2"
                >
                  {"Clear all"}
                </button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-stone-600">
              {loading ? (
                "Loading from backend..."
              ) : (
                <>
                  {"Showing"} <span className="font-bold text-stone-900">{filteredPhotos.length}</span> {"tour experiences"}
                </>
              )}
            </p>
          </div>

          {!loading && loadError && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
              {loadError}
            </div>
          )}

          {loading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
              <h3 className="text-xl font-bold text-stone-800 mb-2">{"Loading Memories"}</h3>
              <p className="text-stone-500 max-w-md mx-auto">{"Getting the latest photos from our travelers' adventures..."}</p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
              <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-4xl mx-auto mb-4">
                📷
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">{"No Photos Found"}</h3>
              <p className="text-stone-500 max-w-md mx-auto">
                {"We couldn't find any photos matching your current filters. Try adjusting your search criteria."}
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-colors cursor-pointer"
              >
                {"Clear All Filters"}
              </button>
            </div>
          ) : (
            <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredPhotos.map((photo, index) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onClick={() => onPhotoClick(photo)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
