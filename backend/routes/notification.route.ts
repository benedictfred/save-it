import {
  getUserNotifications,
  markAllAsRead,
} from "../controllers/notification.controller";
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/history", protect, getUserNotifications);
router.patch("/mark-all-as-read", protect, markAllAsRead);
// router.get("/stream", protect, notificationEventHandler);

export default router;
