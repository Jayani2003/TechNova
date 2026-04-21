import React from 'react';
import { motion } from 'framer-motion';

const CategoryCard = ({ cat, onSelect, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      onClick={() => onSelect(cat)}
      className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all duration-300 cursor-pointer flex flex-col group relative overflow-hidden"
    >
      {/* Background Accent Decor */}
      <div className="absolute -right-4 -top-4 text-slate-50 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <span className="text-9xl font-black">{cat.icon}</span>
      </div>

      <motion.div 
        className="text-5xl mb-6 inline-block"
        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
      >
        {cat.icon}
      </motion.div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-1 text-slate-900">{cat.title}</h3>
        <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 px-2 py-0.5 bg-blue-50 inline-block rounded">
          {cat.tagline}
        </p>
        
        <ul className="space-y-3 mb-10 flex-grow">
          {cat.features.map((feature, i) => (
            <li key={i} className="text-sm text-slate-500 flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3" />
              {feature}
            </li>
          ))}
        </ul>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold group-hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200 group-hover:shadow-blue-200"
        >
          View Specifications
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CategoryCard;