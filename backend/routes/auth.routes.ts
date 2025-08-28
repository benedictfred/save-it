import {
  forgotPassword,
  login,
  logout,
  resendOtp,
  resendVerificationEmail,
  resetPassword,
  setPin,
  signUp,
  verifyEmail,
  verifyPhone,
} from "../controllers/auth.controller";
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-email/:token", verifyEmail);
router.post("/verify-phone", protect, verifyPhone);
router.post("/resend-verification-email", protect, resendVerificationEmail);
router.post("/resend-otp", protect, resendOtp);
router.post("/logout", logout);
router.patch("/pin", protect, setPin);

export default router;
