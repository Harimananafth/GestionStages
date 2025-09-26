const express = require("express");
const router = express.Router();
const ProfilController = require('../controllers/profilController')

router.get("/", ProfilController.getAllProfil)
router.post("/", ProfilController.createProfil)
router.put("/:id", ProfilController.updateProfil)
router.delete("/:id", ProfilController.deleteProfil)

module.exports = {
  prefix: "/profil",
  router
};