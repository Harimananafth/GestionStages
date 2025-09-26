const express = require("express");
const router = express.Router();
const EtudiantController = require('../controllers/etudiantController')

router.post("/", EtudiantController.createEtudiant)
router.get("/", EtudiantController.getAllEtudiants)
router.delete("/:id", EtudiantController.deleteEtudiant)
router.put("/:id", EtudiantController.updateEtudiant)




module.exports = {
  prefix: "/etudiant",
  router
};