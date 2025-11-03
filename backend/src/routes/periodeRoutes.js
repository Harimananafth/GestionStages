const express = require("express");
const router = express.Router();
const PeriodeController = require('../controllers/periodeController')

router.post("/", PeriodeController.createPeriode)
router.get("/", PeriodeController.getAllPeriodes)
router.delete("/:id", PeriodeController.deletePeriode)
router.put("/:id", PeriodeController.updatePeriode)

module.exports = {
  prefix: "/periode",
  router
};