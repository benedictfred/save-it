import { login, protect, signUp } from "@/controllers/auth.controller";
import {
  getAllUsers,
  getDashboard,
  setPin,
  transfer,
} from "@/controllers/user.controller";
import { Router } from "express";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/dashboard", protect, getDashboard);
router.post("/transfer", protect, transfer);
router.patch("/pin", protect, setPin);
router.route("/").get(protect, getAllUsers);

export default router;
