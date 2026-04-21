import React from 'react';
import { motion } from 'framer-motion';

const VehicleDisplay = ({ vehicles, categoryTitle }) => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-6 py-16 bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Available <span className="text-[#00b0a5]">{categoryTitle}</span>
          </h2>
          <p className="text-slate-500 mt-2">Explore our fleet of premium {categoryTitle.toLowerCase()}s.</p>
        </div>
        <div className="bg-[#00b0a5]/10 px-6 py-2 rounded-full text-sm font-bold text-[#00b0a5] self-start">
          {vehicles.length} Models Found
        </div>
      </div>

      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, i) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="relative h-64 overflow-hidden rounded-[2rem] bg-slate-100 mb-6 shadow-inner">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1 rounded-full shadow-lg">
                  <span className="text-sm font-black text-slate-900">${vehicle.price}</span>
                  <span className="text-[10px] text-slate-500 uppercase ml-1">/ day</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#00b0a5] transition-colors">
                {vehicle.name}
              </h3>
              
              <div className="flex gap-6 mb-6">
                 <div className="flex items-center text-sm font-semibold text-slate-500">
                   <span className="mr-2">👤</span> {vehicle.specs.seats} Seats
                 </div>
                 <div className="flex items-center text-sm font-semibold text-slate-500">
                   <span className="mr-2">⚙️</span> {vehicle.specs.transmission}
                 </div>
              </div>

              <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-[#00b0a5] transition-all shadow-lg shadow-slate-200 hover:shadow-[#00b0a5]/30">
                Book This Model
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium text-lg">No specific models listed for this category yet.</p>
        </div>
      )}
    </motion.section>
  );
};

export default VehicleDisplay;