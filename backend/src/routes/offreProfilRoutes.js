const express = require("express");
const router = express.Router();
const OffreProfilController = require('../controllers/offreProfilController')

router.post("/", OffreProfilController.assignProfilToOffre)
router.delete("/:OffreId/:ProfilId", OffreProfilController.removeProfilFromOffre)
router.get("/:OffreId", OffreProfilController.getProfilsOfOffre)



module.exports = {
  prefix: "/offreProfil",
  router
};