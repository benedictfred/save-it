import { protect } from "../controllers/auth.controller";
import {
  getHistory,
  transactionEventHandler,
  transfer,
} from "../controllers/transaction.controller";
import { Router } from "express";

const router = Router();

router.post("/transfer", protect, transfer);
router.get("/history", protect, getHistory);
router.get("/stream", protect, transactionEventHandler);

export default router;
