const express = require("express");
const router = express.Router();
const CandidatureController = require('../controllers/candidatureController')

router.get("/", CandidatureController.getAllcandidature)
router.post("/", CandidatureController.createCandidature)
router.put("/:id", CandidatureController.updateCandidature)
router.put("/status/:id", CandidatureController.updateCandidatureStatus)
router.delete("/:id", CandidatureController.deleteCandidature)





module.exports = {
  prefix: "/candidature",
  router
};