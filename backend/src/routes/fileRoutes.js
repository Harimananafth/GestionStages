const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const FileController = require("../controllers/secureFileController")

router.get("/:idCandidature/view", authMiddleware, FileController.getDocument)





module.exports = {
  prefix: "/file",
  router
};