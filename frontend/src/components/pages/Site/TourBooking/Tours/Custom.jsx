import React from 'react';
import { Link } from 'react-router-dom';

const Custom = () => {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="order-2 md:order-1 space-y-6">
        <h2 className="text-4xl font-bold text-[#005f73]">Customized Tours</h2>
        <p className="text-gray-600 text-lg">
          Your journey, your rules. Select your favorite stops, your preferred vehicle,
          and let us handle the logistics. Freedom is the ultimate luxury.
        </p>
        <Link to="/tour-booking/customized">
          <button className="bg-[#94d2bd] hover:bg-[#0a9396] text-white px-8 py-3 rounded-lg font-medium shadow-md border-2 border-[#0a9396] cursor-pointer transition-all duration-300">
            Design Your Tour
          </button>
        </Link>
      </div>
      <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-2xl">
        <img 
  src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=800" 
  alt="Sri Lankan Hill Country" 
  className="w-full h-80 object-cover" 
/>
      </div>
    </div>
  );
};

export default Custom;