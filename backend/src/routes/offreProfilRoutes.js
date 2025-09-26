const express = require("express");
const router = express.Router();
const OffreProfilController = require('../controllers/offreProfilController')

router.post("/", OffreProfilController.assignProfilToOffre)
router.delete("/:id", OffreProfilController.removeProfilFromOffre)


module.exports = {
  prefix: "/offreProfil",
  router
};