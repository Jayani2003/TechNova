import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { navLinks } from '../../config/navConfig';
import { useTranslation } from 'react-i18next';

const DesktopNav = () => {
  const { t } = useTranslation();
  return (
    <div className="hidden lg:flex items-center gap-10">

      {navLinks.map((link) => (
        <div key={link.nameKey} className="relative group">

          {/* Main Link */}
          <NavLink
            to={link.path}
            
            className={({ isActive }) =>
              `flex items-center gap-1.5 font-bold text-base transition-all duration-300 ${
                isActive ? 'text-[#1fcfc4]' : 'text-[#00b0a5] hover:text-[#1fcfc4] ' 
              }`
            }
          >
            {t(link.nameKey)}

            {link.children && (
              <ChevronDown
                size={14}
                className="transition-transform duration-500 group-hover:rotate-180"
                
              />
            )}
          </NavLink>

          {/* Underline animation */}
          <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#1fcfc4] transition-all duration-300 group-hover:w-full"></span>

          {/* Dropdown */}
          {link.children && (
            <div className="
              absolute top-[140%] left-0 w-56 bg-white rounded-2xl shadow-xl py-3
              opacity-0 invisible translate-y-4 scale-95
              group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100
              transition-all duration-500 ease-out
            ">

              {link.children.map((child) => (
                <NavLink
                  key={child.nameKey}
                  to={child.path}
                  className="block px-5 py-3 text-[#00b0a5] hover:bg-[#1fcfc4]/10 transition-all duration-300"
                >
                  {t(child.nameKey)}
                </NavLink>
              ))}

            </div>
          )}
        </div>
      ))}

    </div>
  );
};

export default DesktopNav;