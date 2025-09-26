// routes/utilisateurRoleRoutes.js
const express = require("express");
const router = express.Router();
const UtilisateurRoleController = require('../controllers/utilisateurRoleController');

// Attribuer un rôle à un utilisateur
router.post("/", UtilisateurRoleController.assignRoleToUser);

// Retirer un rôle d'un utilisateur
// On utilise :utilisateurId et :roleId dans les params
router.delete("/:utilisateurId/:roleId", UtilisateurRoleController.removeRoleFromUser);

module.exports = {
  prefix: "/utilisateurRole", // Préfixe spécifique
  router
};
