import { getDashboard, resolveAccount } from "../controllers/user.controller";
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { readLimiter } from "../middlewares/ratelimit.middleware";

const router = Router();

router.get("/dashboard", readLimiter, protect, getDashboard);
router.get("/:accountNumber", protect, resolveAccount);

export default router;
