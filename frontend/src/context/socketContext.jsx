import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_API_BASE_URL
  : import.meta.env.VITE_API_BASE_URL;

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      path: "/socket.io", 
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket.IO connecté (ID:", newSocket.id, ")");
      setSocket(newSocket);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket.IO déconnecté");
      setSocket(null);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Erreur de connexion Socket.IO:", err.message);
      // Si l'erreur est due à l'auth, on peut déconnecter l'utilisateur
      if (err.message.includes("Authentification")) {
        // Logique de déconnexion
        localStorage.removeItem("utilisateur");
      }
    });

    // --- Gestion de la présence ---
    newSocket.on("users:online:list", (userIds) => {
      setOnlineUsers(userIds);
    });
    newSocket.on("user:online", (userId) => {
      setOnlineUsers((prev) => [...prev, userId]);
    });
    newSocket.on("user:offline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const value = {
    socket,
    onlineUsers,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
