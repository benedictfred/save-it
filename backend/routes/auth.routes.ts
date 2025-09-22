import {
  forgotPassword,
  login,
  logout,
  resendVerificationEmail,
  resetPassword,
  setPin,
  signUp,
  verifyEmail,
} from "../controllers/auth.controller";
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import {
  authLimiter,
  emailVerificationLimiter,
  passwordResetLimiter,
} from "../middlewares/ratelimit.middleware";

const router = Router();

router.post("/signup", authLimiter, signUp);
router.post("/login", authLimiter, login);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-email/:token", verifyEmail);
router.post(
  "/resend-verification-email",
  emailVerificationLimiter,
  protect,
  resendVerificationEmail
);
router.post("/logout", logout);
router.patch("/pin", protect, setPin);

// router.post("/verify-phone", protect, verifyPhone);
// router.post("/resend-otp", protect, resendOtp);

export default router;
