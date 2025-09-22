import {
  ablyEventHandler,
  getHistory,
  transfer,
} from "../controllers/transaction.controller";
import { Router } from "express";
import { checkAccountVerification } from "../middlewares/check-account-verification.middleware";
import { protect } from "../middlewares/auth.middleware";
import {
  readLimiter,
  transactionLimiter,
} from "../middlewares/ratelimit.middleware";

const router = Router();

router.post(
  "/transfer",
  transactionLimiter,
  protect,
  checkAccountVerification,
  transfer
);
router.get("/history", readLimiter, protect, getHistory);
router.get("/stream", protect, ablyEventHandler);

export default router;
