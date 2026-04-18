import { LogIn, User, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow sticky top-0 z-50">

      {/* Logo */}
      <Link to="/">
        <img src="/src/assets/logo4.png" className="h-12" />
      </Link>

      {/* Desktop */}
      <DesktopNav />

      {/* Mobile */}
      <MobileNav />

      {/* Auth */}
      {user ? (
        <div className="relative group flex items-center gap-2 cursor-pointer text-[#00b0a5]">
          <User />
          <span>{user.name}</span>
          <ChevronDown className="group-hover:rotate-180 transition" />

          <div className="absolute right-0 top-full bg-white shadow rounded-lg p-2 opacity-0 group-hover:opacity-100 transition">
            <button onClick={handleLogout} className="text-red-500">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <Link to="/login" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full">
          <LogIn size={16} /> Login
        </Link>
      )}

    </nav>
  );
};

export default Navbar;