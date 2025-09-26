const express = require("express");
const router = express.Router();
const OffreController = require('../controllers/offreController')

router.post("/", OffreController.createOffre)
router.delete("/:id", OffreController.deleteOffre)
router.get("/", OffreController.getAllOffres)
router.put("/:id", OffreController.updateOffre)


module.exports = {
  prefix: "/offre",
  router
};