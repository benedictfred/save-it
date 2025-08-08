import { protect } from "@/controllers/auth.controller";
import {
  getUserNotifications,
  notificationEventHandler,
} from "@/controllers/notification.controller";
import { Router } from "express";

const router = Router();

router.get("/history", protect, getUserNotifications);
router.get("/stream", protect, notificationEventHandler);

export default router;
