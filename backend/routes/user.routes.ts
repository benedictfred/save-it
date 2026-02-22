import {
  getDashboard,
  resolveAccount,
  updatePushToken,
} from "../controllers/user.controller";
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { readLimiter } from "../middlewares/ratelimit.middleware";

const router = Router();

router.get("/dashboard", readLimiter, protect, getDashboard);
router.get("/:accountNumber", protect, resolveAccount);
router.patch("/push-token", protect, updatePushToken);

export default router;
