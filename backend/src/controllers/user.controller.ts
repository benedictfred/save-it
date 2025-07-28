import { prisma } from "@/prisma";
import catchAsync from "@/utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import * as userService from "@/services/user.service";
import { User } from "@prisma/client";
import {
  pinSchema,
  TransferInput,
  transferSchema,
} from "@/validators/user.schema";

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
        ...currentUser,
        hasPin: Boolean(currentUser?.pin),
        recentTransactions,
      },
    });
  }
);

export const transfer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount, recipientAccNumber, pin }: TransferInput =
      transferSchema.parse(req.body);

    const transactionStatus = await userService.transfer({
      senderId: req.user!.id!,
      recipientAccNumber,
      pin,
      amount,
    });

    res.status(200).json({
      status: "success",
      message: "Transfer successful",
      data: transactionStatus,
    });
  }
);

export const setPin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { pin } = pinSchema.parse(req.body);

    await userService.setPin(req.user!.id!, pin);

    res.status(200).json({
      status: "success",
      message: "Pin set successfully",
    });
  }
);
