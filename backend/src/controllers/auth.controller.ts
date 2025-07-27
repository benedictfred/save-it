import { NextFunction, Request, Response } from "express";
import catchAsync from "@/utils/catchAsync";
import * as authService from "@/services/auth.services";

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, token } = await authService.signUp(req.body);

    res.status(201).json({
      status: "success",
      data: { user, token },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, token } = await authService.login(req.body);

    res.status(200).json({
      status: "success",
      user,
      token,
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
