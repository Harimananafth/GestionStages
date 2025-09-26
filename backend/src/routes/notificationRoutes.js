const express = require("express");
const router = express.Router();
const NotificationController = require('../controllers/notificationController')

router.post("/", NotificationController.createNotification)
router.delete("/:id", NotificationController.deleteNotification)
router.get("/", NotificationController.getRecentActualiteNotifications)
router.get("/:id", NotificationController.getUserNotifications)
router.get("/:id", NotificationController.avoirNotificationNonLu)
router.put("/:id", NotificationController.toutMarquerLu)
router.put("/admin", NotificationController.toutMarquerLuAdmin)
router.get("/admin", NotificationController.getAdminNotifications)


module.exports = {
  prefix: "/notification",
  router
};