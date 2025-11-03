const express = require("express");
const router = express.Router();
const NotificationController = require('../controllers/notificationController')
const authMiddleware = require("../middlewares/authMiddleware");


router.get("/", authMiddleware, NotificationController.getRecentActualiteNotifications)
router.post("/", authMiddleware, NotificationController.createNotification)
router.get("/admin", authMiddleware, NotificationController.getAdminNotifications)
router.put("/admin", authMiddleware, NotificationController.toutMarquerLuAdmin)
router.get("/nonLu/:UtilisateurId", authMiddleware, NotificationController.avoirNotificationNonLu)
router.put("/:UtilisateurId", authMiddleware, NotificationController.toutMarquerLu)
router.get("/:UtilisateurId", authMiddleware, NotificationController.getUserNotifications)
router.delete("/:id", authMiddleware, NotificationController.deleteNotification)



module.exports = {
  prefix: "/notification",
  router
};