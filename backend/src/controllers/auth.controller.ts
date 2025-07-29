import { NextFunction, Request, Response } from "express";
import catchAsync from "@/utils/catchAsync";
import * as authService from "@/services/auth.service";
import sendToken from "@/utils/sendToken";
import { pinSchema } from "@/validators/user.schema";

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, token } = await authService.signUp(req.body);

    sendToken(res, token);
    res.status(201).json({
      status: "success",
      user,
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, token } = await authService.login(req.body);

    sendToken(res, token);
    res.status(200).json({
      status: "success",
      user,
    });
  }
);

export const setPin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { pin } = pinSchema.parse(req.body);

    await authService.setPin(req.user!.id!, pin);

    res.status(200).json({
      status: "success",
      message: "Pin set successfully",
    });
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authService.verifyTokenAndUser(req);

    req.user = user;
    next();
  }
);
