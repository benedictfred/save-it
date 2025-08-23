import { NextFunction, Request, Response } from "express";

export function checkAccountVerification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (user.status === "pending") {
    return res.status(403).json({
      status: "fail",
      message:
        "Please verify your email and phone number to access this resource",
    });
  }

  next();
}
