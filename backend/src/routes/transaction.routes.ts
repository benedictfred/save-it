import { protect } from "@/controllers/auth.controller";
import { getHistory, transfer } from "@/controllers/transaction.controller";
import { Router } from "express";

const router = Router();

router.post("/transfer", protect, transfer);
router.get("/history", protect, getHistory);

export default router;
