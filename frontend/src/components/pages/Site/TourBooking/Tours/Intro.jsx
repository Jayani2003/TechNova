import React from 'react';

const Intro = () => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center bg-[#005f73] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {/* Background Pattern or Image */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a9396] to-transparent"></div>
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Ceylon Best Tours</h1>
        <p className="text-xl md:text-2xl font-light mb-8 leading-relaxed">
          Experience the soul of Sri Lanka. We provide premium vehicles and expert drivers 
          to guide you through breathtaking landscapes across our three signature categories.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <span className="px-4 py-2 bg-[#94d2bd] text-[#001219] rounded-full font-semibold">Fixed Packages</span>
          <span className="px-4 py-2 bg-[#94d2bd] text-[#001219] rounded-full font-semibold">Custom Journeys</span>
          <span className="px-4 py-2 bg-[#94d2bd] text-[#001219] rounded-full font-semibold">Point to Point</span>
        </div>
      </div>
    </section>
  );
};

export default Intro;