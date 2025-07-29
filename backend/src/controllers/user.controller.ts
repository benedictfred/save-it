import { prisma } from "@/prisma";
import catchAsync from "@/utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import * as userService from "@/services/user.service";
import { User } from "@prisma/client";
import { sanitizeUser } from "@/utils/sanitize";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany({
      include: {
        transactions: true,
      },
    });
    res.status(200).json({
      users,
    });
  }
);

export const getDashboard = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser, recentTransactions } = await userService.getDashboard(
      req.user as User
    );

    res.status(200).json({
      status: "success",
      data: {
        ...sanitizeUser(currentUser as User),
        hasPin: Boolean(currentUser?.pin),
        recentTransactions,
      },
    });
  }
);

export const resolveAccount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accountNumber } = req.params;

    const user = await userService.resolveAccount(accountNumber);

    res.status(200).json({
      status: "success",
      data: user,
    });
  }
);
