const express = require("express");
const router = express.Router();
const CandidatureController = require("../controllers/candidatureController");
const authMiddleware = require("../middlewares/authMiddleware");
const { cloudinary } = require("../config/cloudinary.config");
const uploadMiddleware = require("../middlewares/multer.config");
const fs = require("fs");

router.get("/", authMiddleware, CandidatureController.getAllcandidature);
router.post(
  "/",
  authMiddleware,
  uploadMiddleware,
  CandidatureController.createCandidature
);

router.get("/t/:id", authMiddleware, CandidatureController.getCandidatureById);
router.get(
  "/st/:id",
  authMiddleware,
  CandidatureController.getStudentCandidature
);
router.get("/:id", authMiddleware, CandidatureController.getCandidatureCard);
router.put("/:id", authMiddleware, CandidatureController.updateCandidature);
router.put(
  "/status/:id",
  authMiddleware,
  CandidatureController.updateCandidatureStatus
);
router.delete("/:id", authMiddleware, CandidatureController.deleteCandidature);

module.exports = {
  prefix: "/candidature",
  router,
};
