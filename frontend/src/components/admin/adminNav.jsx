import React, { useState } from 'react';
import { Home, MessageSquareDot, BriefcaseBusiness, GraduationCap, FileUser, FolderCog } from 'lucide-react';
import { Link } from "react-router-dom";


// Données pour les éléments de menu
const menuItems = [
  { id:1, to: 'home', icon: Home, name: 'Dashboard' },
  { id:2, to: 'profile', icon: MessageSquareDot, name: 'Messages' },
  { id:3, to: 'analytics', icon: BriefcaseBusiness, name: 'Offres de stage' },
  { id:4, to: 'messages', icon: GraduationCap, name: 'Etudiants' },
  { id:5, to: 'notifications', icon: FileUser, name: 'Candidatures' },
  { id:6, to: 'settings', icon: FolderCog, name: 'Profils' },
];

// Le composant principal de l'application
export default function AdNavbar(){
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center">
            
      <nav 
        className="relative bg-white shadow-lg flex  h-screen items-center justify-center"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div className="p-2 relative z-10">
            
          {/* L'élément "bulle" qui se déplace pour l'effet gooey */}
          <div
            className="absolute top-2 left-2 w-12 h-12 bg-sky-600 rounded-xl transition-transform duration-300 ease-out"
            style={{
              transform: hoveredIndex !== null ? `translateY(${hoveredIndex * 64}px)` : 'translateY(0)',
              opacity: hoveredIndex !== null ? 1 : 0, // Cache la bulle si rien n'est survolé
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
                  {/* L'icône */}
                  <item.icon 
                    className={`w-6 h-6 transition-colors duration-300 ${hoveredIndex === index ? 'text-white' : 'text-[#4F5D75]'}`} 
                  />
                  
                  {/* Le nom du menu qui apparaît au survol */}
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
  );
};


