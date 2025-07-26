import { prisma } from "@/prisma";
import catchAsync from "@/utils/catchAsync";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, phoneNumber, password, email }: Prisma.UserCreateInput =
      req.body;

    const user = await prisma.user.create({
      data: { name, phoneNumber, password, email },
    });

    res.status(201).json({
      status: "success",
      data: { user },
    });
  }
);
