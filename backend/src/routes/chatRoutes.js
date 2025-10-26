const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware"); // Votre middleware d'auth

// Middleware pour vérifier le rôle
const isAdmin = (req, res, next) => {
  if (req.user && req.user.roles.includes("admin")) {
    next();
  } else {
    res.status(403).json({ message: "Accès réservé aux administrateurs." });
  }
};

// [Admin] Route pour voir toutes les discussions
router.get(
  "/discussions",
  authMiddleware,
  isAdmin,
  chatController.getAllDiscussions
);

// [Étudiant] Route pour récupérer sa propre discussion
router.get("/discussion", authMiddleware, chatController.getMyDiscussion);

// [Tous] Route pour récupérer les messages d'une discussion
router.get(
  "/discussions/:discussionId/messages",
  authMiddleware,
  chatController.getMessagesForDiscussion
);

module.exports = {
  prefix: "/chat",
  router,
};
