import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GalleryCard from "./GalleryCard";
import DetailModal from "./DetailModal";
import FilterBar from "./FilterBar"; // Nested inside the Grid section

const categories = ["All", "Vehicles", "Destinations", "Tours", "Experiences"];

const images = [
  {
    id: 1,
    title: "Scenic Routes",
    category: "Destinations",
    location: "Ella",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    desc: "Explore breathtaking roads across Sri Lanka with panoramic mountain views.",
  },
  {
    id: 2,
    title: "Luxury Interior",
    category: "Vehicles",
    location: "Colombo",
    img: "https://images.unsplash.com/photo-1493238792000-8113da705763",
    desc: "Experience the ultimate comfort with our fleet of premium chauffeur-driven cars.",
  },
  {
    id: 3,
    title: "Wildlife Safari",
    category: "Tours",
    location: "Yala",
    img: "https://images.unsplash.com/photo-1508672019048-805c876b67e2",
    desc: "Get up close with leopards and elephants in their natural habitat.",
  },
  {
    id: 4,
    title: "Coastal Breeze",
    category: "Destinations",
    location: "Mirissa",
    img: "https://images.unsplash.com/photo-1512100356956-c1227c3317bb",
    desc: "Sun-kissed beaches and whale watching adventures.",
  },
];

export default function GalleryGrid() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = images.filter((item) => 
    (active === "All" || item.category === active) &&
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <FilterBar 
        active={active} 
        setActive={setActive} 
        setSearch={setSearch} 
        categories={categories} 
      />
      
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <GalleryCard key={item.id} item={item} index={index} onClick={setSelected} />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selected && <DetailModal selected={selected} setSelected={setSelected} />}
      </AnimatePresence>
    </>
  );
}