import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { Send, User, Loader2, Circle, ArrowLeft, ArrowRight } from "lucide-react";
import { useSocket } from "../../context/socketContext";

const ApiUrl = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_API_URL
  : import.meta.env.VITE_API_URL;

// Fetcher SWR
const fetcher = (url) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

// --- Composant Bulle de Message ---
const MessageBubble = ({ message, estEnvoyeur, headerAvatar }) => {
  const alignClass = estEnvoyeur ? "chat-end" : "chat-start";
  const bubbleClass = estEnvoyeur
    ? "chat-bubble-info text-white rounded-xl rounded-br-none"
    : "rounded-xl rounded-bl-none";

  return (
    <div className={`chat ${alignClass} `}>
      {!estEnvoyeur && headerAvatar ? (
        <div className="chat-image avatar">
          <div className="w-6 rounded-full">
            <img
              src={headerAvatar}
              alt="Avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
          </div>
        </div>
      ) : (
        !estEnvoyeur && (
          <div className="chat-image avatar">
            <div className="w-6 rounded-full">
              <img
                src="/images/default-img-profil.png"
                alt="Avatar"
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
          </div>
        )
      )}

      <div className="chat-header">
        <time className="text-xs opacity-50">
          {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
      <div className={`chat-bubble  ${bubbleClass} `}>
        <p className="text-sm" style={{ overflowWrap: "break-word" }}>
          {message.contenu}
        </p>
      </div>
      {estEnvoyeur && (
        <div className="chat-footer opacity-50">
          {message.estLu ? "vu" : "delivré"}
        </div>
      )}
    </div>
  );
};

// --- Composant Principal ---
export default function ChatWindow({
  discussionId,
  utilisateur,
  headerTitle,
  headerAvatar,
  onCloseChat = () => {},
}) {
  const { socket, onlineUsers } = useSocket();
  const [contenu, setContenu] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const messagesEndRef = useRef(null); // Pour scroller en bas

  // 1. Récupérer l'historique des messages
  const {
    data: messagesData,
    error,
    isLoading,
  } = useSWR(
    discussionId ? `${ApiUrl}/chat/discussions/${discussionId}/messages` : null,
    fetcher
  );

  // 2. Mettre à jour l'état des messages
  useEffect(() => {
    if (messagesData?.data) {
      setMessages(messagesData.data);
    }
  }, [messagesData]);

  // 3. Écouteurs Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (nouveauMessage) => {
      if (nouveauMessage.DiscussionId === discussionId) {
        setMessages((prev) => [...prev, nouveauMessage]);
      }
    };

    const handleTypingDisplay = ({
      user,
      discussionId: typingDiscussionId,
    }) => {
      if (typingDiscussionId === discussionId) {
        setTypingUser(user);
      }
    };

    const handleTypingHide = ({ user, discussionId: typingDiscussionId }) => {
      if (typingDiscussionId === discussionId) {
        setTypingUser(null);
      }
    };

    socket.on("message:receive", handleNewMessage);
    socket.on("typing:display", handleTypingDisplay);
    socket.on("typing:hide", handleTypingHide);

    return () => {
      socket.off("message:receive", handleNewMessage);
      socket.off("typing:display", handleTypingDisplay);
      socket.off("typing:hide", handleTypingHide);
    };
  }, [socket, discussionId]);

  // 4. Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  // 5. Logique d'envoi de "est en train d'écrire"
  const typingTimeoutRef = useRef(null);
  const handleTyping = () => {
    if (!socket) return;
    socket.emit("typing:start", { discussionId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (!socket) return;
      socket.emit("typing:stop", { discussionId });
      typingTimeoutRef.current = null;
    }, 3000);
  };

  // 6. Envoi du message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contenu.trim() || !socket) return;

    socket.emit("message:send", {
      discussionId: discussionId,
      contenu: contenu.trim(),
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit("typing:stop", { discussionId });
    }

    setContenu("");
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-500" size={32} />
      </div>
    );
  }

  const isAdmin = utilisateur?.roles?.includes("admin");

  if (error) {
    return <p>Erreur de chargement des messages.</p>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* En-tête mis à jour */}
      <div className="flex items-center  p-2 md:p-4  border-b border-gray-200 bg-white shadow-sm flex-shrink-0">
        {/* Bouton admin retour sur mobile*/}
        {isAdmin && (
          <button
            onClick={onCloseChat}
            className="md:hidden p-2 mr-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <div className="relative mr-3">
          <img
            src={headerAvatar || "/images/default-img-profil.png"}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          {/* <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span> */}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">
            {headerTitle || "Discussion"}
          </h3>
          {/* <p className="text-xs text-green-500">En ligne</p> */}
        </div>
      </div>

      {/* Corps des messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            estEnvoyeur={msg.UtilisateurId === utilisateur.id}
            headerAvatar={headerAvatar}
          />
        ))}

        {/* Indicateur "est en train d'écrire" */}
        {typingUser && typingUser.id !== utilisateur.id && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-6 rounded-full">
                <img
                  src={headerAvatar || "/images/default-img-profil.png"}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="chat-bubble rounded-xl rounded-bl-none flex items-center justify-center">
              <p className="text-sm text-sky-600 flex gap-1.5 items-center">
                <Circle size={6} className="animate-pulse fill-sky-600" />
                <Circle
                  size={6}
                  className="animate-pulse fill-sky-600"
                  style={{ animationDelay: "200ms" }}
                />
                <Circle
                  size={6}
                  className="animate-pulse fill-sky-600"
                  style={{ animationDelay: "400ms" }}
                />
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Pied de page */}
      <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Tapez votre message..."
            className="input grow text-sm text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
            value={contenu}
            onChange={(e) => {
              setContenu(e.target.value);
              handleTyping();
            }}
          />
          <button
            type="submit"
            className="p-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 disabled:bg-sky-300
                       flex-shrink-0  items-center justify-center transition-colors duration-200"
            disabled={!contenu.trim()}
          >
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
