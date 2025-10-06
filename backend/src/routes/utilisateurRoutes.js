const express = require("express");
const router = express.Router();
const UtilisateurController = require('../controllers/utilisateurController')
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", UtilisateurController.createUtilisateur)
router.put("/:id", authMiddleware, UtilisateurController.updateUtilisateur)
router.delete("/:id", authMiddleware, UtilisateurController.deleteUtilisateur)


module.exports = {
  prefix: "/utilisateur",
  router
};