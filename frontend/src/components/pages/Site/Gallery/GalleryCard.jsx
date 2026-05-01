import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const GalleryCard = ({ item, onClick }) => (
  <motion.div
    layout // Use layout for smooth grid repositioning
    layoutId={`card-${item.id}`}
    whileHover={{ y: -5 }}
    onClick={() => onClick(item)}
    className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 cursor-pointer"
  >
    <div className="aspect-[4/5] overflow-hidden">
      <img 
        src={item.img} 
        className="w-full h-full object-cover" 
        alt={item.title}
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
      <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
    </div>
  </motion.div>
);

export default GalleryCard;