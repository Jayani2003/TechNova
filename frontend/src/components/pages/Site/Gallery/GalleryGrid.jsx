import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import GalleryCard from "./GalleryCard";
import DetailModal from "./DetailModal";
import FilterBar from "./FilterBar"; // Nested inside the Grid section
import { buildApiUrl } from "../../../../config/api";

export default function GalleryGrid() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadGallery = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(buildApiUrl("/gallery"), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load gallery: ${response.status}`);
        }

        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Failed to load gallery.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadGallery();

    return () => controller.abort();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set();

    items.forEach((item) => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });

    return ["All", ...Array.from(uniqueCategories)];
  }, [items]);

  const galleryItems = items.map((item) => ({
    ...item,
    img: item.image_url || item.url,
    desc: item.description || "",
  }));

  const filtered = galleryItems.filter((item) => 
    (active === "All" || item.category === active) &&
    `${item.title} ${item.desc}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <FilterBar active={active} setActive={setActive} setSearch={setSearch} categories={categories} />

      {/* Reduced motion on the container itself */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-16 text-slate-500">Loading gallery...</div>
        ) : error ? (
          <div className="col-span-full text-center py-16 text-rose-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-slate-500">No gallery images found.</div>
        ) : (
          <AnimatePresence>
            {filtered.map((item) => (
              <GalleryCard 
                key={item.id} 
                item={item} 
                onClick={setSelected} 
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <DetailModal selected={selected} setSelected={setSelected} />
        )}
      </AnimatePresence>
    </>
  );
}