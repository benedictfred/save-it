import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import * as authService from "../services/auth.service";
import { pinSchema } from "../validators/user.schema";
import { clearCookie, sendCookie } from "../utils/cookie";

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, token, message } = await authService.signUp(req.body);

    sendCookie(res, token);
    res.status(201).json({
      status: "success",
      user,
      message,
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, token } = await authService.login(req.body);

    sendCookie(res, token);
    res.status(200).json({
      status: "success",
      user,
    });
  }
);

export const setPin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { pin } = pinSchema.parse(req.body);

    await authService.setPin(req.user.id, pin);

    res.status(200).json({
      status: "success",
      message: "Pin set successfully",
    });
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await authService.forgotPassword(email);

    res.status(200).json({
      status: "success",
      message: "A reset link was sent to your email",
    });
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;

    await authService.resetPassword(req.body, token);

    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  }
);

export const verifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;

    const { message } = await authService.verifyEmail(token);

    res.status(200).json({
      status: "success",
      message,
    });
  }
);

export const verifyPhone = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;

    const { message } = await authService.verifyPhoneOTP(req.user.id, otp);

    res.status(200).json({
      status: "success",
      message,
    });
  }
);

export const resendVerificationEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { message } = await authService.sendVerificationEmail(req.user.id);

    res.status(200).json({
      status: "success",
      message,
    });
  }
);

export const resendOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { message } = await authService.sendPhoneVerificationOTP(req.user.id);

    res.status(200).json({
      status: "success",
      message,
    });
  }
);

export const logout = (req: Request, res: Response) => {
  clearCookie(res);
  res.status(200).json({ message: "Logged out successfully" });
};
