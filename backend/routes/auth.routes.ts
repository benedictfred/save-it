import {
  forgotPassword,
  googleAuth,
  login,
  logout,
  resendVerificationEmail,
  resetPassword,
  setPin,
  signUp,
  updatePassword,
  updateTransactionPin,
  validateResetOtp,
  verifyEmail,
} from "../controllers/auth.controller";
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import {
  authLimiter,
  emailVerificationLimiter,
  passwordResetLimiter,
} from "../middlewares/ratelimit.middleware";
import { checkAccountVerification } from "../middlewares/check-account-verification.middleware";

const router = Router();

router.post("/signup", authLimiter, signUp);
router.post("/login", authLimiter, login);
router.post("/google", authLimiter, googleAuth);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/validate-otp", validateResetOtp);
router.post("/verify-email", verifyEmail);
router.post(
  "/resend-verification-email",
  emailVerificationLimiter,
  protect,
  resendVerificationEmail,
);
router.post("/logout", logout);
router.patch("/pin", protect, checkAccountVerification, setPin);
router.patch(
  "/update-password",
  protect,
  checkAccountVerification,
  updatePassword,
);
router.patch(
  "/update-pin",
  protect,
  checkAccountVerification,
  updateTransactionPin,
);

// router.post("/verify-phone", protect, verifyPhone);
// router.post("/resend-otp", protect, resendOtp);

export default router;
