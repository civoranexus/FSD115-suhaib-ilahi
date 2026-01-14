import { Router } from "express";
import notificationController from "../controllers/notificationController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get("/", authenticate, notificationController.getUserNotifications);
router.put(
  "/:notificationId/read",
  authenticate,
  notificationController.markNotificationAsRead
);
router.put(
  "/read-all",
  authenticate,
  notificationController.markAllNotificationsAsRead
);
router.delete(
  "/:notificationId",
  authenticate,
  notificationController.deleteNotification
);
router.delete("/", authenticate, notificationController.deleteAllNotifications);

export default router;
