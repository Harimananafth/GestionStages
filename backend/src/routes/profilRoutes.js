const express = require("express");
const router = express.Router();
const ProfilController = require('../controllers/profilController')
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, ProfilController.getAllProfil)
router.post("/", authMiddleware, ProfilController.createProfil)
router.put("/:id", authMiddleware, ProfilController.updateProfil)
router.delete("/:id", authMiddleware, ProfilController.deleteProfil)

module.exports = {
  prefix: "/profil",
  router
};