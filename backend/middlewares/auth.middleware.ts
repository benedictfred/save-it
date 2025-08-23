import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomJwtPayload, verifyToken } from "../utils/jwt";
import { prisma } from "../prisma/prisma";

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies?.jwt;

    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError("Please log in to get access", 401);
    }

    const decoded = verifyToken(token) as CustomJwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      omit: {
        passwordChangedAt: false,
      },
    });

    if (!user) {
      throw new AppError("The user that has this token does not exist", 401);
    }

    if (user.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        user.passwordChangedAt.getTime() / 1000
      );
      if (decoded.iat! < changedTimestamp) {
        throw new AppError(
          "Password was changed after token was issued. Please log in again.",
          401
        );
      }
    }

    req.user = user;
    next();
  }
);
