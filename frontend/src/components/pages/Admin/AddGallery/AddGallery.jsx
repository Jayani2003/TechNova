import React, { useState, useRef, useCallback } from "react";
import { UploadCloud, Camera, MapPin } from "lucide-react";
import Topbar from "./Topbar";
import StatCards from "./StatCards";
import UploadTab from "./UploadTab";
import GalleryTab from "./GalleryTab";
import LocationsTab from "./LocationsTab";
import LightboxModal from "./LightboxModal";
import Toast from "./Toast";
import { SAMPLE_PHOTOS, INIT_LOCS } from "./constants";

export default function AddGallery() {
  const [tab, setTab] = useState("gallery");
  const [photos, setPhotos] = useState(SAMPLE_PHOTOS);
  const [locations, setLocations] = useState(INIT_LOCS);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toastTimer = useRef(null);

  const showToast = useCallback((message) => {
    setToast({ message, visible: true });
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  const TITLES = {
    upload: "Publish New Tour Photograph",
    gallery: "Tour Gallery Manager",
    locations: "Sri Lanka Geographical Navigator",
  };

  const navItems = [
    { key: "upload", icon: <UploadCloud className="w-4 h-4" />, label: "Upload Photos" },
    { key: "gallery", icon: <Camera className="w-4 h-4" />, label: "All Photos", badge: photos.length },
    { key: "locations", icon: <MapPin className="w-4 h-4" />, label: "Locations", badge: locations.length },
  ];

  const handleAddPhoto = (newPhoto) => {
    setPhotos((prev) => [newPhoto, ...prev]);
    setLocations((prevLocs) =>
      prevLocs.map((l) => (l.name.toLowerCase() === newPhoto.loc.toLowerCase() ? { ...l, photos: l.photos + 1 } : l))
    );
    setTab("gallery");
  };

  const handleToggleStatus = (photo, e) => {
    e?.stopPropagation();
    const nextStatus = photo.status === "published" ? "draft" : "published";
    setPhotos((prev) => prev.map((item) => (item.id === photo.id ? { ...item, status: nextStatus } : item)));
    showToast(`"${photo.title}" changed to ${nextStatus.toUpperCase()}`);
  };

  const handleDeletePhoto = (id, e) => {
    e?.stopPropagation();
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    showToast("Selected photograph has been removed.");
  };

  return (
    <div
      className="min-h-screen bg-[#FAF9F6] text-[#1D1916] antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <div className="flex flex-col min-h-screen">
        <Topbar 
          title={TITLES[tab]}
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            if (tab !== "gallery") {
              setTab("gallery");
            }
          }}
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-2 sm:p-3 shadow-sm">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer"
                  style={{
                    background: tab === item.key ? "#00b0a5" : "#F5F5F4",
                    color: tab === item.key ? "#fff" : "#44403C",
                  }}
                >
                  <span className={tab === item.key ? "text-white" : "text-stone-500"}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-extrabold"
                      style={{
                        background: tab === item.key ? "rgba(255,255,255,0.22)" : "#E7E5E4",
                        color: tab === item.key ? "#fff" : "#292524",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <StatCards photos={photos} locations={locations} />

          {tab === "upload" && <UploadTab locations={locations} onToast={showToast} onAddPhoto={handleAddPhoto} />}

          {tab === "gallery" && (
            <GalleryTab
              photos={
                searchTerm
                  ? photos.filter(
                      (p) =>
                        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.loc.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  : photos
              }
              setPhotos={setPhotos}
              onToast={showToast}
              onViewPhoto={(p) => setSelectedPhoto(p)}
            />
          )}

          {tab === "locations" && <LocationsTab locations={locations} setLocations={setLocations} onToast={showToast} />}
        </div>
      </div>

      {selectedPhoto && (
        <LightboxModal
          p={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeletePhoto}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}