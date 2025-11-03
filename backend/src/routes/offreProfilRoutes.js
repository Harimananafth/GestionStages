const express = require("express");
const router = express.Router();
const OffreProfilController = require('../controllers/offreProfilController')
const authMiddleware = require("../middlewares/authMiddleware");


router.post("/", authMiddleware, OffreProfilController.assignProfilToOffre)
router.delete("/:OffreId/:ProfilId", authMiddleware, OffreProfilController.removeProfilFromOffre)
router.get("/:OffreId", authMiddleware, OffreProfilController.getProfilsOfOffre)
router.put("/:OffreId/:ProfilId", authMiddleware, OffreProfilController.updateProfilCount)



module.exports = {
  prefix: "/offreProfil",
  router
};