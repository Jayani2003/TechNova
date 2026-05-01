import { motion } from "framer-motion";

const DetailModal = ({ selected, setSelected }) => (
  <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelected(null)}
      className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
    />
    <motion.div
      layoutId={`card-${selected.id}`}
      onClick={() => setSelected(null)}
      className="relative bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col md:flex-row"
    >
      <div className="w-full md:w-1/2 h-72 md:h-auto overflow-hidden">
        <img src={selected.img} className="w-full h-full object-cover" alt={selected.title} />
      </div>
      <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
        <span className="text-[#00b0a5] font-bold text-sm uppercase tracking-widest mb-2">{selected.category}</span>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{selected.title}</h2>
        <p className="text-slate-600 leading-relaxed mb-8 text-lg">{selected.desc}</p>
      </div>
    </motion.div>
  </div>
);

export default DetailModal;