const express = require("express");
const router = express.Router();
const OffreController = require('../controllers/offreController')
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, OffreController.createOffre)
router.delete("/:id", authMiddleware, OffreController.deleteOffre)
router.get("/", OffreController.getAllOffres)
router.put("/:id", authMiddleware, OffreController.updateOffre)
router.get("/:id", OffreController.getOffreById)


module.exports = {
  prefix: "/offre",
  router
};