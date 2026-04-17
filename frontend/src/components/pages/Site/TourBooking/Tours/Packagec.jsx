// import { Link } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Packagec = () => {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="rounded-2xl overflow-hidden shadow-2xl">
        <img src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=800" alt="Tour Packages" className="w-full h-80 object-cover" />
      </div>
      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-[#005f73]">Tour Packages</h2>
        <p className="text-gray-600 text-lg">
          Choose from our expertly crafted itineraries. From the Hill Country mist to the 
          Golden Beaches, our fixed packages offer the best value with a dedicated driver.
        </p>
       <Link to="/tour-booking/package">
        <button className="bg-[#0a9396] hover:bg-[#005f73] text-white px-8 py-3 rounded-lg transition-all font-medium shadow-md">
          Explore Packages
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Packagec;