import {
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  setPin,
  signUp,
} from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);
router.patch("/pin", protect, setPin);

export default router;
