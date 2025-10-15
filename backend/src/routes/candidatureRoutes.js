const express = require("express");
const router = express.Router();
const CandidatureController = require('../controllers/candidatureController')
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware,  CandidatureController.getAllcandidature)
router.post("/", authMiddleware, CandidatureController.createCandidature)
router.put("/:id", authMiddleware, CandidatureController.updateCandidature)
router.put("/status/:id", authMiddleware, CandidatureController.updateCandidatureStatus)
router.delete("/:id", authMiddleware, CandidatureController.deleteCandidature)
router.get("/:id", authMiddleware, CandidatureController.getCandidatureCard)





module.exports = {
  prefix: "/candidature",
  router
};