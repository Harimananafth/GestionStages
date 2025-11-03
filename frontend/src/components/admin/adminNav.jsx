import React, { useState } from 'react';
import { 
  Home, 
  MessageSquareDot, 
  BriefcaseBusiness, 
  GraduationCap, 
  FileUser, 
  FolderCog 
} from 'lucide-react';
import { NavLink, useLocation } from "react-router-dom"; // NavLink utile mais on utilise useLocation aussi
import { ROUTES } from "../../routes/paths";

// Données pour les éléments de menu (TOUTES les routes en absolu)
const menuItems = [
  { id:1, to: ROUTES.ADMIN.DASHBOARD, icon: Home, name: 'Tableau de bord' },
  { id:2, to: '/a/messages', icon: MessageSquareDot, name: 'Messages' },
  { id:3, to: ROUTES.ADMIN.OFFRE, icon: BriefcaseBusiness, name: 'Offres de stage' },
  { id:4, to: '/a/etudiants', icon: GraduationCap, name: 'Etudiants' },
  { id:5, to: '/a/notifications', icon: FileUser, name: 'Candidatures' },
  { id:6, to: '/a/settings', icon: FolderCog, name: 'Profils' },
];

function normalizePath(p) {
  if (!p) return p;
  if (p === '/') return '/';
  return p.replace(/\/+$/, ''); // supprime slash final s'il y en a
}

export default function AdNavbar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const location = useLocation();

  const pathname = normalizePath(location.pathname);

  // Calculer l'index actif de façon robuste
  const activeIndex = menuItems.findIndex(item => {
    if (!item.to) return false;
    const itemPath = normalizePath(item.to);

    // Dashboard exact only
    if (itemPath === normalizePath(ROUTES.ADMIN.DASHBOARD)) {
      return pathname === itemPath;
    }

    // exact match or prefix (for subroutes)
    if (pathname === itemPath) return true;
    if (pathname.startsWith(itemPath + '/')) return true;
    return false;
  });

  // style de la bulle : si rien d'actif et pas de hover, on la cache (opacity:0)
  const bubbleStyle = {
    transform: hoveredIndex !== null 
      ? `translateY(${hoveredIndex * 64}px)` 
      : activeIndex >= 0 
        ? `translateY(${activeIndex * 64}px)` 
        : 'translateY(0)',
    opacity: hoveredIndex !== null || activeIndex >= 0 ? 1 : 0,
  };

  return (
    <>
      {/* Barre latérale desktop */}
      <div className="min-h-screen flex items-center justify-center lg:block hidden">
        <nav 
          className="relative bg-white shadow-lg flex h-screen items-center justify-center"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="p-2 relative z-10">
            {/* Bulle bleue */}
            <div
              className="absolute top-2 left-2 w-12 h-12 bg-sky-600 rounded-xl transition-transform duration-300 ease-out"
              style={bubbleStyle}
            />

            <ul className="relative flex flex-col items-center gap-4">
              {menuItems.map((item, index) => (
                <li 
                  key={item.id}
                  className="w-12 h-12"
                  onMouseEnter={() => setHoveredIndex(index)}
                >
                  <NavLink 
                    to={item.to} 
                    end={item.to === ROUTES.ADMIN.DASHBOARD} // end=true pour dashboard => exact match navlink
                    className="group w-full h-full flex items-center justify-center rounded-xl relative transition-colors duration-300"
                  >
                  <item.icon
                    className={`w-6 h-6 transition-colors duration-300 ${
                      hoveredIndex !== null
                        ? (hoveredIndex === index ? 'text-white' : 'text-[#4F5D75]')
                        : (activeIndex === index ? 'text-white' : 'text-[#4F5D75]')
                    }`}
                  />

                    <span 
                      className="absolute left-full ml-4 px-3 py-2 bg-white text-sky-600 text-sm font-medium rounded-md shadow-lg whitespace-nowrap
                                 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0
                                 transition-all duration-300 pointer-events-none"
                    >
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Barre inférieure (mobile) */}
      <nav className="w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] order-2 lg:order-1 block lg:hidden fixed bottom-0 left-0 z-10">
        <ul className="flex justify-around items-center h-14 sm:h-20 max-w-2xl mx-auto px-2 sm:px-4">
          {menuItems.map((item, index) => (
            <li key={item.id} className="relative">
              <NavLink 
                to={item.to}
                end={item.to === ROUTES.ADMIN.DASHBOARD}
                className="flex flex-col items-center justify-center w-14 h-12 sm:w-16 sm:h-16"
              >
                <span
                  className={`
                    absolute -top-1 left-1/2 -translate-x-1/2
                    w-6 sm:w-8 h-1 bg-sky-600 rounded-full
                    transition-all duration-300 ease-in-out
                    ${index === activeIndex ? 'scale-x-100' : 'scale-x-0'}
                  `}
                />
                <item.icon 
                  className={`
                    w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-300
                    ${index === activeIndex ? 'text-sky-600' : 'text-[#4F5D75]'}
                  `}
                />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
