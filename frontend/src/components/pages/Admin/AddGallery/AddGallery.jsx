import React, { useState, useRef, useCallback, useEffect } from "react";
import { UploadCloud, Camera, MapPin } from "lucide-react";
import Topbar from "./Topbar";
import StatCards from "./StatCards";
import UploadTab from "./UploadTab";
import GalleryTab from "./GalleryTab";
import LocationsTab from "./LocationsTab";
import LightboxModal from "./LightboxModal";
import Toast from "./Toast";
import {
  fetchGalleryPhotos,
  createGalleryPhoto,
  updateGalleryPhotoStatus,
  deleteGalleryPhoto,
  fetchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../../../services/galleryService";

export default function AddGallery() {
  const [tab, setTab] = useState("gallery");
  const [photos, setPhotos] = useState([]);
  const [locations, setLocations] = useState([]);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
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

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [photoRows, locationRows] = await Promise.all([fetchGalleryPhotos(), fetchLocations()]);
      setPhotos(photoRows);
      setLocations(locationRows);
    } catch (error) {
      showToast(error.message || "Failed to load gallery data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddPhoto = async ({ file, payload }) => {
    try {
      const created = await createGalleryPhoto({ file, payload });
      setPhotos((prev) => [created, ...prev]);
      const locationRows = await fetchLocations();
      setLocations(locationRows);
      setTab("gallery");
      showToast(`"${created.title}" added to the gallery.`);
    } catch (error) {
      showToast(error.message || "Failed to save photo.");
      throw error;
    }
  };

  const handleToggleStatus = async (photo, e) => {
    e?.stopPropagation();
    const nextStatus = photo.status === "published" ? "draft" : "published";
    try {
      const updated = await updateGalleryPhotoStatus(photo.id, nextStatus);
      setPhotos((prev) => prev.map((item) => (item.id === photo.id ? updated : item)));
      showToast(`"${photo.title}" changed to ${nextStatus.toUpperCase()}`);
    } catch (error) {
      showToast(error.message || "Failed to update status.");
    }
  };

  const handleDeletePhoto = async (id, e) => {
    e?.stopPropagation();
    try {
      await deleteGalleryPhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      const locationRows = await fetchLocations();
      setLocations(locationRows);
      showToast("Selected photograph has been removed.");
    } catch (error) {
      showToast(error.message || "Failed to delete photo.");
    }
  };

  const handleCreateLocation = async (payload) => {
    const created = await createLocation(payload);
    setLocations((prev) => [...prev, created]);
    return created;
  };

  const handleUpdateLocation = async (id, payload) => {
    const updated = await updateLocation(id, payload);
    setLocations((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const handleDeleteLocation = async (id) => {
    await deleteLocation(id);
    setLocations((prev) => prev.filter((item) => item.id !== id));
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
              onToast={showToast}
              onViewPhoto={(p) => setSelectedPhoto(p)}
              onDeletePhoto={handleDeletePhoto}
              onToggleStatus={handleToggleStatus}
            />
          )}

          {tab === "locations" && (
            <LocationsTab
              locations={locations}
              onToast={showToast}
              onCreateLocation={handleCreateLocation}
              onUpdateLocation={handleUpdateLocation}
              onDeleteLocation={handleDeleteLocation}
            />
          )}

          {loading && <p className="mt-4 text-xs font-semibold text-stone-500">Loading gallery data...</p>}
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