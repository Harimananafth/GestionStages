const express = require("express");
const router = express.Router();
const UtilisateurController = require('../controllers/utilisateurController')

router.post("/", UtilisateurController.createUtilisateur)
router.put("/:id", UtilisateurController.updateUtilisateur)
router.delete("/:id", UtilisateurController.deleteUtilisateur)


module.exports = {
  prefix: "/utilisateur",
  router
};