import React, { useState, useEffect } from "react";
import useSWR from "swr";
import DiscussionList from "../components/chat/discussionList";
import ChatWindow from "../components/chat/chatWindow";
import { useSocket } from "../context/socketContext";
import { Loader2 } from "lucide-react";

const ApiUrl = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_API_URL
  : import.meta.env.VITE_API_URL;

const fetcher = (url) =>
  fetch(url, { credentials: "include" }).then(async (res) => {
    if (!res.ok) {
      const error = new Error("An error occurred while fetching the data.");
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
    return res.json();
  });

export default function ChatPage() {
  const [utilisateur, setUtilisateur] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("utilisateur");
    if (storedUser) {
      setUtilisateur(JSON.parse(storedUser));
    }
  }, []);

  const { socket } = useSocket();
  const [activeDiscussionId, setActiveDiscussionId] = useState(null);

  const isAdmin = utilisateur?.roles?.includes("admin");

  // --- Data Fetching ---

  // 1. Si ADMIN: Récupère toutes les discussions
  const {
    data: adminData,
    error: adminError,
    isLoading: adminLoading,
    mutate: mutateDiscussions,
  } = useSWR(isAdmin ? `${ApiUrl}/chat/discussions` : null, fetcher);

  // 2. Si ETUDIANT: Récupère SA discussion
  const {
    data: etudiantData,
    error: etudiantError,
    isLoading: etudiantLoading,
  } = useSWR(
    !isAdmin && utilisateur ? `${ApiUrl}/chat/discussion` : null,
    fetcher
  );

  // --- Gestion Socket (Mise à jour de la liste des discussions) ---
  useEffect(() => {
    if (!socket || !isAdmin) return;

    const handleNewMessage = (nouveauMessage) => {
      mutateDiscussions((currentData) => {
        if (!currentData) return;

        const discussionIndex = currentData.data.findIndex(
          (d) => d.id === nouveauMessage.DiscussionId
        );

        if (discussionIndex > -1) {
          const updatedDiscussion = {
            ...currentData.data[discussionIndex],
            dernierMessage: {
              contenu: nouveauMessage.contenu,
              createdAt: nouveauMessage.createdAt,
              estLu: false,
              UtilisateurId: nouveauMessage.UtilisateurId,
            },
            dernierMessageAt: nouveauMessage.createdAt,
          };

          const discussionsSansCelleUpdate = currentData.data.filter(
            (d) => d.id !== nouveauMessage.DiscussionId
          );
          return {
            data: [updatedDiscussion, ...discussionsSansCelleUpdate],
          };
        }
        return currentData;
      }, false);
    };

    socket.on("message:receive", handleNewMessage);
    return () => {
      socket.off("message:receive", handleNewMessage);
    };
  }, [socket, isAdmin, mutateDiscussions]);

  const handleCloseChat = () => {
    setActiveDiscussionId(null);
  };

  // --- Logique de rendu ---

  if (!utilisateur) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  // Rendu ADMIN
  if (isAdmin) {
    if (adminLoading)
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-sky-500" size={32} />
        </div>
      );
    if (adminError)
      return (
        <div className="p-4 text-error">Erreur: {adminError.info?.message}</div>
      );

    const discussions = adminData?.data || [];
    const activeDiscussion = discussions.find(
      (d) => d.id === activeDiscussionId
    );

    return (
      <div
        className="flex flex-col md:flex-row w-full bg-white rounded-xl shadow-lg 
                   overflow-hidden animate-[text-appear-bottom_0.5s_ease-in] h-full "
      >
        {/* Colonne de gauche (Liste) */}
        <div
          className={`
            ${
              activeDiscussionId && "hidden md:flex"
            } /* Cache la liste sur mobile si un chat est ouvert */
            md:w-1/3 lg:w-[360px] /* Largeur fixe sur grand écran */
            w-full h-full flex flex-col border-r border-gray-200
          `}
        >
          <DiscussionList
            discussions={discussions}
            activeDiscussionId={activeDiscussionId}
            onSelectDiscussion={setActiveDiscussionId}
          />
        </div>

        {/* Colonne de droite (Chat)  */}
        <div
          className={`
            ${
              !activeDiscussionId && "hidden md:flex"
            } /* Cache la fenêtre si pas de sélection sur mobile */
            flex-grow
            w-full h-full flex flex-col
          `}
        >
          {activeDiscussionId ? (
            <ChatWindow
              key={activeDiscussionId}
              discussionId={activeDiscussionId}
              utilisateur={utilisateur}
              headerTitle={activeDiscussion?.etudiant?.nom || "Discussion"}
              headerAvatar={activeDiscussion?.etudiant?.photo}
              onCloseChat={handleCloseChat}
            />
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              Sélectionnez une discussion pour commencer.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Rendu ETUDIANT
  if (!isAdmin) {
    if (etudiantLoading)
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-sky-500" size={32} />
        </div>
      );
    if (etudiantError)
      return (
        <div className="p-4 text-red-600">
          Erreur: {etudiantError.info?.message}
        </div>
      );

    const discussionId = etudiantData?.data?.id;

    return (
      <div
        className="flex h-full w-full bg-white rounded-xl shadow-lg 
                   overflow-hidden animate-[text-appear-bottom_0.5s_ease-in]"
      >
        {/* L'étudiant ne voit que sa propre fenêtre de chat */}
        <div className="w-full flex flex-col">
          {discussionId ? (
            <ChatWindow
              discussionId={discussionId}
              utilisateur={utilisateur}
              headerTitle="Service des stages"
            />
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              Erreur: Impossible de charger la discussion.
            </div>
          )}
        </div>
      </div>
    );
  }
}
