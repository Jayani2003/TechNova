import { ChevronDown, LogIn } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-10 py-5 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm w-full sticky top-0 z-[100]">
      
      {/* Logo Section */}
      <div className="flex items-center group cursor-pointer">
        <img 
          src="/src/assets/logo2.jpg" 
          alt="Lanka Wheels Logo" 
          className="h-12 w-auto object-contain transition-transform duration-700 group-hover:scale-105" 
        />
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex items-center gap-10">
        {/* Consistent Blue Links */}
        {['Home', 'Vehicle Category', 'Reviews', 'About Us', 'Contact Us', 'Gallery'].map((link) => (
          <a 
            key={link}
            href="#" 
            className="relative text-blue-600 font-bold text-base tracking-wide group"
          >
            {link}
            {/* Animated Underline */}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
        ))}
        
        {/* Dropdown Menu - Now also Blue by default */}
        <div className="relative group flex items-center gap-1.5 text-blue-600 cursor-pointer">
          <span className="font-semibold text-base tracking-wide">Tour Booking</span>
          <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-500 ease-in-out" />
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>

          {/* Luxury Dropdown */}
          <div className="absolute top-[140%] left-0 w-56 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl py-3 
                          opacity-0 invisible translate-y-4 scale-95
                          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 
                          transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-50">
            <div className="flex flex-col">
              <a href="#" className="px-5 py-3 text-base text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 flex justify-between items-center group/item">
                Point-to-Point
                <span className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300">→</span>
              </a>
              <a href="#" className="px-5 py-3 text-base text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 flex justify-between items-center group/item">
                Package Tours
                <span className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Login Button */}
      <button className="relative flex items-center gap-2 bg-[#1a1a1c] text-white px-7 py-3 rounded-full text-sm font-semibold 
                        overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95">
        <LogIn size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="z-10">Login</span>
        {/* Subtle Shine Effect */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></span>
      </button>
    </nav>
  );
};

export default Navbar;