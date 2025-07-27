import { prisma } from "@/prisma";
import catchAsync from "@/utils/catchAsync";
import { NextFunction, Request, Response } from "express";

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.create({
      data: req.body,
    });

    res.status(201).json({
      status: "success",
      user,
    });
  }
);

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
