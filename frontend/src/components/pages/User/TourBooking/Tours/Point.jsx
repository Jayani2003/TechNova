// import { Link } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Point = () => {
  return (
    <div className="bg-[#f1faff] rounded-3xl p-12 grid md:grid-cols-2 gap-12 items-center">
      <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white">
        <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800" alt="Point to Point" className="w-full h-80 object-cover" />
      </div>
      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-[#005f73]">Point to Point</h2>
        <p className="text-gray-600 text-lg"> 
          Reliable transfers between any two locations in Sri Lanka. Professional drivers 
          and air-conditioned vehicles waiting just for you.
        </p>
        <Link to="/tour-booking/point">
        <button className="bg-[#001219] hover:bg-[#005f73] text-white px-8 py-3 rounded-lg transition-all font-medium">
          Book a Transfer
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Point;