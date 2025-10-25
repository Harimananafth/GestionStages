const express = require("express");
const router = express.Router();
const UtilisateurController = require('../controllers/utilisateurController')
const authMiddleware = require("../middlewares/authMiddleware");
const uploadPhoto = require("../middlewares/uploadPhoto");

router.post("/", UtilisateurController.createUtilisateur)
router.put(
  "/:id",
  uploadPhoto,
  authMiddleware,
  UtilisateurController.updateUtilisateurPhoto
);
router.delete("/:id", authMiddleware, UtilisateurController.deleteUtilisateur)


module.exports = {
  prefix: "/utilisateur",
  router
};