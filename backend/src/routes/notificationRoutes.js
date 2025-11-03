const express = require("express");
const router = express.Router();
const NotificationController = require('../controllers/notificationController')

router.get("/", NotificationController.getRecentActualiteNotifications)
router.post("/", NotificationController.createNotification)
router.get("/admin", NotificationController.getAdminNotifications)
router.put("/admin", NotificationController.toutMarquerLuAdmin)
router.get("/nonLu/:UtilisateurId", NotificationController.avoirNotificationNonLu)
router.put("/:UtilisateurId", NotificationController.toutMarquerLu)
router.get("/:UtilisateurId", NotificationController.getUserNotifications)
router.delete("/:id", NotificationController.deleteNotification)



module.exports = {
  prefix: "/notification",
  router
};