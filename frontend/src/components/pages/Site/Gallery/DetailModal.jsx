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
      className="relative bg-white rounded-[2rem] overflow-hidden w-full max-w-4xl h-[min(78vh,640px)] shadow-2xl border border-slate-100 flex flex-col md:flex-row"
    >
      <div className="w-full md:w-[46%] h-64 md:h-full overflow-hidden">
        <img src={selected.img} className="w-full h-full object-cover" alt={selected.title} />
      </div>
      <div className="w-full md:w-[54%] p-6 md:p-8 flex flex-col justify-center gap-3 overflow-y-auto">
        <span className="inline-flex w-fit items-center rounded-full bg-[#00b0a5]/10 px-3 py-1.5 text-[#00b0a5] font-bold text-xs uppercase tracking-[0.25em]">
          {selected.category || "Gallery Type"}
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          {selected.title}
        </h2>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Description</p>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            {selected.desc}
          </p>
        </div>
      </div>
    </motion.div>
  </div>
);

export default DetailModal;