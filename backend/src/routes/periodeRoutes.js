const express = require("express");
const router = express.Router();
const PeriodeController = require('../controllers/periodeController')
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, PeriodeController.createPeriode)
router.get("/", authMiddleware, PeriodeController.getAllPeriodes)
router.delete("/:id", authMiddleware, PeriodeController.deletePeriode)
router.put("/:id", authMiddleware, PeriodeController.updatePeriode)

module.exports = {
  prefix: "/periode",
  router
};