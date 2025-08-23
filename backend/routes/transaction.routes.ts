import {
  ablyEventHandler,
  getHistory,
  transfer,
} from "../controllers/transaction.controller";
import { Router } from "express";
import { checkAccountVerification } from "../middlewares/check-account-verification.middleware";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/transfer", protect, checkAccountVerification, transfer);
router.get("/history", protect, getHistory);
router.get("/stream", protect, ablyEventHandler);

export default router;
