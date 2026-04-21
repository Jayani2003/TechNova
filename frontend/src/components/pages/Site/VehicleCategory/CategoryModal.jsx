import React from 'react';
import { motion } from 'framer-motion';

const CategoryModal = ({ selected, onClose }) => {
  if (!selected) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotateX: 15 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="bg-white rounded-[2.5rem] max-w-xl w-full p-8 md:p-12 shadow-2xl relative border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors text-2xl"
        >
          ✕
        </button>

        <div className="text-6xl mb-6">{selected.icon}</div>
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
          {selected.title}
        </h2>
        <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-6">
          {selected.tagline}
        </p>
        
        <p className="text-slate-500 text-lg leading-relaxed mb-8">
          {selected.description}
        </p>
        
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-50 p-8 rounded-3xl border border-slate-100"
        >
          <h4 className="text-xs font-black uppercase text-slate-400 mb-5 tracking-[0.2em] text-center">
            Key Performance Metrics
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {selected.features.map((f, i) => (
              <div key={i} className="bg-white border border-slate-200 px-5 py-3 rounded-xl text-sm font-bold text-slate-700 shadow-sm flex items-center">
                <span className="text-blue-500 mr-3">✦</span> {f}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CategoryModal;