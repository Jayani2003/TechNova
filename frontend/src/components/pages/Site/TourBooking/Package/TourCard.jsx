import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react';

const TourCard = ({ tour }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full transition-all duration-300">
      <div className="relative h-64">
        <img src={tour.mainImage} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full flex items-center gap-2 text-[#005f73] font-bold shadow-lg">
          <Clock size={16} /> {tour.days} Days
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-[#001219] mb-3">{tour.title}</h3>
        <p className="text-gray-600 mb-6 line-clamp-3">{tour.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {tour.highlights.map((h, i) => (
            <span key={i} className="text-xs font-semibold uppercase tracking-wider bg-gray-100 text-gray-500 px-3 py-1 rounded-md">
              {h}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 space-y-6 border-t pt-6"
            >
              <h4 className="font-bold text-[#0a9396] flex items-center gap-2 text-lg">
                <MapPin size={18} /> Detailed Itinerary
              </h4>
              
              {tour.detailedPlaces.map((place, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  {/* Itinerary Image */}
                  <img 
                    src={place.image} 
                    alt={place.name} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <span className="font-bold text-gray-800 flex items-center gap-2">
                      <CheckCircle size={16} className="text-[#94d2bd]" /> {place.name}
                    </span>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{place.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto flex gap-4">
          <button 
            className="flex-2 bg-[#ee9b00] text-white py-4 px-6 rounded-2xl font-bold hover:bg-[#ca6702] transition-all shadow-lg shadow-orange-200"
            onClick={() => alert('Redirecting to Booking Form...')}
          >
            Book Now
          </button>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex-1 flex items-center justify-center gap-2 border-2 py-4 rounded-2xl font-bold transition-all ${
              isExpanded 
              ? "border-gray-300 text-gray-500 hover:bg-gray-100" 
              : "border-[#005f73] text-[#005f73] hover:bg-[#005f73] hover:text-white"
            }`}
          >
            {isExpanded ? (
              <>Less Info <ChevronUp size={20} /></>
            ) : (
              <>More Info <ChevronDown size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
