import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronRight } from 'lucide-react'; // Added ChevronRight

const reviews = [
  { id: 1, name: "Michael Chen", date: "2026-03-01", service: "Customized Tour", rating: 5, text: "Outstanding! This was the highlight of our Sri Lanka trip. Highly recommended!" },
  { id: 2, name: "David Martinez", date: "2026-02-28", service: "Vehicle Rental - Toyota Prius", rating: 5, text: "Amazing experience! Best car rental service in Sri Lanka. Professional drivers and clean vehicles." },
  { id: 3, name: "Lisa Anderson", date: "2026-02-26", service: "Package Tour - Coastal Paradise", rating: 5, text: "Perfect tour package! Saw all the amazing sights and our guide was incredibly knowledgeable." },
  { id: 4, name: "Sarah Jay", date: "2026-02-20", service: "Airport Transfer", rating: 5, text: "Punctual and very friendly. The car was spotless and the drive was very smooth." },
  { id: 5, name: "James Wilson", date: "2026-02-15", service: "Hill Country Tour", rating: 5, text: "The views were breathtaking. Everything was organized perfectly from start to finish." }
];

const ReviewSliderDark = () => {
  const [index, setIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1 >= reviews.length ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [index, isPaused]);

  const getVisibleReviews = () => {
    const result = [];
    for (let i = 0; i < itemsToShow; i++) {
      result.push(reviews[(index + i) % reviews.length]);
    }
    return result;
  };

  return (
    <section className="py-20 px-6 bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center md:text-left">
            What Our <span className="text-[#00b0a5]">Customers</span> Say
          </h2>
          <div className="hidden md:block h-[1px] flex-grow mx-8 bg-gray-800"></div>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-[0.2em]">Trusted Reviews</p>
        </div>

        {/* Slider Area */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-6 justify-center min-h-[320px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {getVisibleReviews().map((review, i) => (
                <motion.div
                  key={`${review.id}-${index}-${i}`}
                  layout
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full md:w-1/2 lg:w-1/3"
                >
                  <div className="h-full bg-[#111111] border-2 border-[#00b0a5]/30 rounded-[2rem] p-8 shadow-2xl relative hover:border-[#00b0a5] transition-all duration-500 group">
                    <Quote className="absolute top-6 right-6 text-[#00b0a5]/5 group-hover:text-[#00b0a5]/10 transition-colors" size={60} />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-[#00b0a5] transition-colors">
                            {review.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, starIdx) => (
                                <Star key={starIdx} size={14} fill="currentColor" />
                              ))}
                            </div>
                            <span className="text-[10px] text-white uppercase tracking-widest mt-1">
                              {review.date}
                            </span>
                          </div>
                        </div>
                        <div className="text-white px-2 py-1 rounded text-xs font-bold border border-[#00b0a5]/20">
                          {review.rating}.0
                        </div>
                      </div>

                      <p className="text-[#00b0a5] text-xs font-bold mb-4 uppercase tracking-widest">
                        {review.service}
                      </p>

                      <p className="text-gray-400 leading-relaxed italic flex-grow">
                        "{review.text}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`transition-all duration-500 rounded-full h-1.5 ${
                i === index 
                ? "w-12 bg-[#00b0a5] shadow-[0_0_15px_rgba(0,176,165,0.4)]" 
                : "w-2 bg-gray-800 hover:bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* --- NEW: SEE MORE REVIEWS BUTTON --- */}
        <div className="flex justify-center mt-12">
          <a 
            href="/reviews" 
            className="group flex items-center gap-2 px-8 py-4 border border-[#00b0a5]/30 rounded-full text-white font-bold hover:bg-[#00b0a5] hover:border-[#00b0a5] transition-all duration-300 shadow-xl hover:shadow-[#00b0a5]/20"
          >
            <span>SEE MORE REVIEWS</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ReviewSliderDark;