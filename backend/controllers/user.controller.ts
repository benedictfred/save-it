import { prisma } from "../prisma/prisma";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user.service";
import { sanitizeUser } from "../utils/sanitize";
import { User } from "@prisma/client";

export const getDashboard = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser, recentTransactions, recentNotifications } =
      await userService.getDashboard(req.user as User);

    res.status(200).json({
      status: "success",
      data: {
        ...sanitizeUser(currentUser as User),
        hasPin: Boolean(currentUser?.pin),
        recentTransactions,
        recentNotifications,
      },
    });
  },
);

export const resolveAccount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accountNumber } = req.params;
    const { accountNumber: userAccountNumber } = req.user;

    const user = await userService.resolveAccount(
      accountNumber,
      userAccountNumber,
    );

    res.status(200).json({
      status: "success",
      data: user,
    });
  },
);
