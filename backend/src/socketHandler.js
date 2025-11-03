const jwt = require("jsonwebtoken");
const { Discussion, Message, Utilisateur } = require("./Models");

// Pour suivre les utilisateurs en ligne (UserId -> SocketId)
const onlineUsers = new Map();

// Fonction pour authentifier le socket via le cookie JWT
const authenticateSocket = (socket, next) => {
  try {
    // Tente de récupérer le cookie 'token'
    const cookieString = socket.handshake.headers.cookie;
    if (!cookieString) {
      return next(new Error("Authentification échouée : Cookie manquant."));
    }

    const token = cookieString
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return next(new Error("Authentification échouée : Token manquant."));
    }

    // Vérifie le token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attache les infos utilisateur au socket pour usage futur
    socket.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles || [],
    };
    next();
  } catch (err) {
    console.error("Erreur authentification socket:", err.message);
    next(new Error("Authentification échouée : Token invalide."));
  }
};

// Fonction principale
function initializeSocket(io) {
  // Applique le middleware d'authentification à CHAQUE connexion
  io.use(authenticateSocket);

  // Écoute les connexions
  io.on("connection", async (socket) => {
    console.log(
      `Un utilisateur est connecté : ${socket.user.email} (ID: ${socket.user.id})`
    );
    const userId = socket.user.id;
    const userRoles = socket.user.roles;

    //  Gestion de la présence (En ligne) 
    onlineUsers.set(userId, socket.id);
    // Informe tout le monde que cet utilisateur est en ligne
    socket.broadcast.emit("user:online", userId);
    // Envoie la liste des utilisateurs déjà en ligne au nouvel arrivant
    socket.emit("users:online:list", Array.from(onlineUsers.keys()));

    //  Gestion des "Rooms" (Salons) 
    socket.join(userId.toString());

    if (userRoles.includes("admin")) {
      // Si c'est un admin, il rejoint le salon "admins"
      socket.join("admins");
      console.log(`L'admin ${userId} a rejoint le salon 'admins'`);
    } else {
      // Si c'est un étudiant, il rejoint le salon de sa discussion
      try {
        const [discussion] = await Discussion.findOrCreate({
          where: { UtilisateurId: userId },
        });
        // L'étudiant rejoint un salon nommé d'après l'ID de sa discussion
        socket.join(`discussion:${discussion.id}`);
        console.log(
          `L'étudiant ${userId} a rejoint le salon 'discussion:${discussion.id}'`
        );
      } catch (error) {
        console.error(
          "Erreur lors de la recherche/création de discussion:",
          error
        );
      }
    }

    //  Écoute des messages envoyés par le client 
    socket.on("message:send", async (data) => {
      try {
        const { discussionId, contenu } = data;
        const envoyeurId = socket.user.id;

        // 1. Sauvegarder le message en BDD
        const nouveauMessage = await Message.create({
          DiscussionId: discussionId,
          UtilisateurId: envoyeurId,
          contenu: contenu,
          estLu: false,
        });

        // 2. Mettre à jour le timestamp de la discussion
        await Discussion.update(
          { dernierMessageAt: new Date() },
          { where: { id: discussionId } }
        );

        // 3. Récupérer le message complet avec les infos de l'envoyeur
        const messageComplet = await Message.findByPk(nouveauMessage.id, {
          include: [
            { model: Utilisateur, as: "envoyeur", attributes: ["id", "photo"] },
          ],
        });

        // 4. Diffuser le message aux bonnes personnes

        // Envoyer à l'étudiant (qui est dans le salon 'discussion:ID')
        io.to(`discussion:${discussionId}`).emit(
          "message:receive",
          messageComplet
        );

        // Envoyer à tous les admins (qui sont dans le salon 'admins')
        io.to("admins").emit("message:receive", messageComplet);
      } catch (err) {
        console.error("Erreur lors de l'envoi du message:", err);
        // Envoyer une erreur au client
        socket.emit("message:error", "Erreur lors de l'envoi du message.");
      }
    });

    //  Gestion de "est en train d'écrire" 
    socket.on("typing:start", (data) => {
      const { discussionId } = data;
      socket
        .to(`discussion:${discussionId}`)
        .emit("typing:display", { user: socket.user, discussionId }); 

      // Diffuse à tout le monde SAUF à l'envoyeur DANS LA SALLE ADMINS
      socket
        .to("admins")
        .emit("typing:display", { user: socket.user, discussionId }); 
    });

    socket.on("typing:stop", (data) => {
      const { discussionId } = data;
      // Diffuse à tout le monde SAUF à l'envoyeur DANS LA SALLE DE DISCUSSION
      socket
        .to(`discussion:${discussionId}`)
        .emit("typing:hide", { user: socket.user, discussionId }); 

      // Diffuse à tout le monde SAUF à l'envoyeur DANS LA SALLE ADMINS
      socket
        .to("admins")
        .emit("typing:hide", { user: socket.user, discussionId }); 
    });

    // --- Déconnexion ---
    socket.on("disconnect", () => {
      console.log(
        `Utilisateur déconnecté : ${socket.user.email} (ID: ${userId})`
      );
      onlineUsers.delete(userId);
      // Informe tout le monde que l'utilisateur est hors ligne
      socket.broadcast.emit("user:offline", userId);
    });
  });
}

module.exports = { initializeSocket };
