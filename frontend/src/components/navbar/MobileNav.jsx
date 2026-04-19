import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navLinks } from '../../config/navConfig';
import { Link } from 'react-router-dom';

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <div className="lg:hidden">

      {/* Toggle */}
      <button onClick={() => { setOpen(!open); setActiveDropdown(null); } }>
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menu */}
      <div className={`absolute top-16 left-0 w-full bg-white shadow-md transition-all duration-500 ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>

        <div className="p-5 space-y-4">

          {navLinks.map((link, index) => (
            <div key={link.name}>

              {/* Main */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  link.children
                    ? setActiveDropdown(activeDropdown === index ? null : index)
                    : setOpen(false)
                }
              >
                <Link to={link.path} className="text-[#00b0a5] hover:text-[#188c85] font-semibold">
                  {link.name}
                </Link>
                {link.children && <span>▼</span>}
              </div>

              {/* Dropdown */}
              {link.children && activeDropdown === index && (
                <div className="ml-4 mt-2 space-y-2 animate-fadeIn">
                  {link.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.path}
                      onClick={() => setOpen(false)}
                      className="block text-sm text-[#00b0a5] hover:text-[#188c85]"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default MobileNav;