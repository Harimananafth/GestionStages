const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const EtudiantController = require('../controllers/etudiantController')

router.post("/", authMiddleware, EtudiantController.createEtudiant)
router.get("/", authMiddleware, EtudiantController.getAllEtudiants)
router.get("/fiche/:id", authMiddleware, EtudiantController.getFicheEtudiant)
router.get("/:id", authMiddleware, EtudiantController.getEtudiantByUserId)
router.delete("/:id", authMiddleware, EtudiantController.deleteEtudiant)
router.put("/:id", authMiddleware, EtudiantController.updateEtudiant)




module.exports = {
  prefix: "/etudiant",
  router
};