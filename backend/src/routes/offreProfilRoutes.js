const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const OffreProfilController = require('../controllers/offreProfilController')
const authMiddleware = require("../middlewares/authMiddleware");


router.post("/", authMiddleware, OffreProfilController.assignProfilToOffre)
router.delete("/:OffreId/:ProfilId", authMiddleware, OffreProfilController.removeProfilFromOffre)
router.get("/:OffreId", authMiddleware, OffreProfilController.getProfilsOfOffre)



module.exports = {
  prefix: "/offreProfil",
  router
};