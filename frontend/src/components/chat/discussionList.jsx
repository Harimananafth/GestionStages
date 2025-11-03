import React, { useState, useMemo } from "react";
import { User, Search } from "lucide-react";
import { useSocket } from "../../context/socketContext";

// Helper pour formater la date
const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  if (minutes < 1440) return `il y a ${Math.floor(minutes / 60)} h`;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
};

// --- Composant Enfant  ---
const DiscussionItem = ({ discussion, isActive, onSelect, onlineUsers }) => {
  const { etudiant, dernierMessage } = discussion;

  const isOnline = onlineUsers.includes(etudiant.id);

  const isUnread =
    dernierMessage &&
    !dernierMessage.estLu &&
    dernierMessage.UtilisateurId === etudiant.id;

  return (
    <div
      className={`flex items-center p-3 cursor-pointer hover:bg-sky-50 ${
        isActive ? "bg-sky-100" : "bg-white"
      } border-b border-gray-200 transition-colors duration-150 w-full`}
      onClick={() => onSelect(discussion.id)}
    >
            {/* Avatar et statut en ligne */}
      <div className="relative flex-shrink-0 mr-3">
        {etudiant.photo ? (
          <img
            src={etudiant.photo}
            alt={etudiant.nom}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={20} className="text-gray-500" />
          </div>
        )}
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
            {/* Info Nom + Message */}
      <div className="flex-grow overflow-hidden">
        <p
          className={`font-semibold text-gray-800 truncate ${
            isUnread ? "font-bold" : ""
          }`}
        >
          {etudiant.nom}
        </p>
        <p
          className={`text-sm text-gray-500 truncate ${
            isUnread ? "text-sky-600 font-medium" : ""
          }`}
        >
                    {dernierMessage ? dernierMessage.contenu : "Aucun message"} 
        </p>
      </div>
            {/* Info Date + Pastille non lue */} 
      <div className="flex-shrink-0 ml-2 flex flex-col items-end">
               
        <span className="text-xs text-gray-400">
                    {formatRelativeTime(dernierMessage?.createdAt)}       
        </span>
               
        {isUnread && (
          <span className="w-2.5 h-2.5 bg-sky-500 rounded-full mt-2"></span>
        )}
             
      </div>
         
    </div>
  );
};

// --- Composant Principal avec Recherche ---
export default function DiscussionList({
  discussions,
  activeDiscussionId,
  onSelectDiscussion,
}) {
  const { onlineUsers } = useSocket();
  // 1. État pour stocker la valeur du champ de recherche
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Fonction de filtrage
  const filteredDiscussions = useMemo(() => {
    if (!searchTerm) {
      return discussions;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    return discussions.filter((d) => {
      // Rechercher par le nom de l'étudiant
      const etudiantName = d.etudiant?.nom?.toLowerCase() || "";
      if (etudiantName.includes(lowerCaseSearch)) {
        return true;
      }
      // Rechercher dans le contenu du dernier message
      const lastMessageContent = d.dernierMessage?.contenu?.toLowerCase() || "";
      if (lastMessageContent.includes(lowerCaseSearch)) {
        return true;
      }

      // Vous pouvez ajouter d'autres critères de recherche ici (prénom, etc.)

      return false;
    });
  }, [discussions, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-white">
            {/* En-tête + Recherche */}   
      <div className="p-4 border-b border-gray-200">
               
        <h2 className="montserrat-hero font-bold text-xl text-sky-400 mb-4">
          Messages      
        </h2>
               
        <div className="relative">
                   
          <input
            type="text"
            placeholder="Rechercher une dicussion"
            // 3. Lier l'input à l'état
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 z-10 pr-4 py-2 input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
          />
                 
          <Search
            size={16}
            className="text-gray-400 absolute top-3 left-3 z-20"
          />
                 
        </div>
             
      </div>
            {/* Liste */}   
      <div className="flex-grow overflow-y-auto mr-4 mb-4">
        {/* 4. Utiliser la liste filtrée pour le rendu */} 
        {filteredDiscussions.length === 0 ? (
          <p className="p-4 text-center text-gray-500">
            {searchTerm ? "Aucune discussion trouvée." : "Aucune discussion."}
          </p>
        ) : (
          filteredDiscussions.map((d) => (
            <DiscussionItem
              key={d.id}
              discussion={d}
              isActive={d.id === activeDiscussionId}
              onSelect={onSelectDiscussion}
              onlineUsers={onlineUsers}
            />
          ))
        )}
           
      </div>
       
    </div>
  );
}
