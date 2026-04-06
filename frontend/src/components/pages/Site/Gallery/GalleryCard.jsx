import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

const GalleryCard = ({ item, index, onClick }) => (
  <motion.div
    layoutId={`card-${item.id}`}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    whileHover={{ y: -8 }}
    onClick={() => onClick(item)}
    className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 cursor-pointer"
  >
    <div className="aspect-[4/5] overflow-hidden">
      <motion.img src={item.img} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
      <div className="flex items-center gap-2 mb-2 text-[#00b0a5]">
        <MapPin size={14} />
        <span className="text-xs font-bold uppercase tracking-widest">{item.location}</span>
      </div>
      <h3 className="text-2xl font-bold leading-tight mb-2">{item.title}</h3>
      <div className="flex items-center gap-2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
        <span>View Journey</span>
        <ArrowRight size={16} />
      </div>
    </div>
  </motion.div>
);

export default GalleryCard;