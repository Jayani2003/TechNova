import { ChevronDown, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Navigation mapping for easier management
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Vehicle Category', path: '/vehicle' }, // ✅ fixed
  { name: 'Reviews', path: '/reviews' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Gallery', path: '/gallery' },
];

  return (
    <nav className="flex items-center justify-between px-10 py-5 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm w-full sticky top-0 z-[100]">
      
      {/* Logo Section */}
      <Link to="/" className="flex items-center group cursor-pointer">
        <img 
          src="/src/assets/logo4.png" 
          alt="Lanka Wheels Logo" 
          className="h-15 w-auto object-contain transition-transform duration-700 group-hover:scale-105" 
        />
      </Link>

      {/* Navigation Links */}
      <div className="hidden lg:flex items-center gap-10">
        {navLinks.map((link) => (
          <Link 
            key={link.name}
            to={link.path} 
            className="relative text-[#00b0a5] font-bold text-base tracking-wide group"
          >
            {link.name}
            {/* Animated Underline - Updated to #00b0a5 */}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00b0a5] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}
        
        {/* Dropdown Menu - Updated to #00b0a5 */}
        <div className="relative group flex items-center gap-1.5 text-[#00b0a5] cursor-pointer">
          <span className="font-semibold text-base tracking-wide">Tour Booking</span>
          <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-500 ease-in-out" />
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00b0a5] transition-all duration-300 group-hover:w-full"></span>

          {/* Luxury Dropdown */}
          <div className="absolute top-[140%] left-0 w-56 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl py-3 
                          opacity-0 invisible translate-y-4 scale-95
                          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 
                          transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-50">
            <div className="flex flex-col">
              <Link to="/tour/point" className="px-5 py-3 text-base text-[#00b0a5] hover:bg-[#00b0a5]/10 transition-all duration-300 flex justify-between items-center group/item">
                Point-to-Point
                <span className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300">→</span>
              </Link>
              <Link to="/tour/package" className="px-5 py-3 text-base text-[#00b0a5] hover:bg-[#00b0a5]/10 transition-all duration-300 flex justify-between items-center group/item">
                Package Tours
                <span className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300">→</span>
              </Link>
              <Link to="/tour/customized" className="px-5 py-3 text-base text-[#00b0a5] hover:bg-[#00b0a5]/10 transition-all duration-300 flex justify-between items-center group/item">
                Customized Tours
                <span className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Login Button */}
      <Link to="/login" className="relative flex items-center gap-2 bg-[#1a1a1c] text-white px-7 py-3 rounded-full text-sm font-semibold 
                        overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#00b0a5]/20 active:scale-95">
        <LogIn size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="z-10">Login</span>
        {/* Subtle Shine Effect */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></span>
      </Link>
      
    </nav>
  );
};

export default Navbar;