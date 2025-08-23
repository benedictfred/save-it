import {
  getAllUsers,
  getDashboard,
  resolveAccount,
} from "../controllers/user.controller";
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/dashboard", protect, getDashboard);
router.route("/:accountNumber").get(protect, resolveAccount);
// router.route("/").get(protect, getAllUsers);

export default router;
