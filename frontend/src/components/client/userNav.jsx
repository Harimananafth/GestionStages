import React, { useState } from 'react';
import { Home, MessageSquareDot, BriefcaseBusiness, FileUser } from 'lucide-react';
import { Link } from "react-router-dom";
import { ROUTES } from '../../routes/paths';

// Données pour les éléments de menu
const menuItems = [
  { id: 1, to: ROUTES.USER.DASHBOARD, icon: Home, name: 'Tableau de bord' },
  { id: 2, to: 'profile', icon: MessageSquareDot, name: 'Messages' },
  { id: 3, to: 'analytics', icon: BriefcaseBusiness, name: 'Offres de stage' },
  { id: 4, to: 'notifications', icon: FileUser, name: 'Candidatures' },
];

export default function UserNavbar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      {/* Version bureau (sidebar verticale) */}
      <div className="min-h-screen flex items-center justify-center lg:block hidden">
        <nav
          className="relative bg-white shadow-lg flex h-screen items-center justify-center"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="p-2 relative z-10">
            {/* Bulle d’animation */}
            <div
              className="absolute top-2 left-2 w-12 h-12 bg-sky-600 rounded-xl transition-transform duration-300 ease-out"
              style={{
                transform:
                  hoveredIndex !== null
                    ? `translateY(${hoveredIndex * 64}px)`
                    : 'translateY(0)',
                opacity: hoveredIndex !== null ? 1 : 0,
              }}
            />

            <ul className="relative flex flex-col items-center gap-4">
              {menuItems.map((item, index) => (
                <li
                  key={item.id}
                  className="w-12 h-12"
                  onMouseEnter={() => setHoveredIndex(index)}
                >
                  <Link
                    to={item.to}
                    className="group w-full h-full flex items-center justify-center rounded-xl relative transition-colors duration-300"
                  >
                    {/* Icône */}
                    <item.icon
                      className={`w-6 h-6 transition-colors duration-300 ${
                        hoveredIndex === index
                          ? 'text-white'
                          : 'text-[#4F5D75]'
                      }`}
                    />

                    {/* Nom visible au survol */}
                    <span
                      className="absolute left-full ml-4 px-3 py-2 bg-white text-sky-600 text-sm font-medium rounded-md shadow-lg whitespace-nowrap
                                 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0
                                 transition-all duration-300 pointer-events-none"
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/*Version mobile (barre en bas) */}
      <nav className="w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] order-2 lg:order-1 block lg:hidden fixed bottom-0 left-0 z-50">
        <ul className="flex justify-around items-center h-14 sm:h-20 max-w-2xl mx-auto px-2 sm:px-4">
          {menuItems.map((item, index) => (
            <li key={item.id} className="relative">
              <Link
                to={item.to}
                className="flex flex-col items-center justify-center w-14 h-12 sm:w-16 sm:h-16"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveIndex(index);
                }}
              >
                {/* Indicateur actif (trait au-dessus de l’icône) */}
                <span
                  className={`
                    absolute -top-1 left-1/2 -translate-x-1/2
                    w-6 sm:w-8 h-1 bg-sky-600 rounded-full
                    transition-all duration-300 ease-in-out
                    ${activeIndex === index ? 'scale-x-100' : 'scale-x-0'}
                  `}
                />

                {/* Icône */}
                <item.icon
                  className={`
                    w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-300
                    ${activeIndex === index ? 'text-sky-600' : 'text-[#4F5D75]'}
                  `}
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
