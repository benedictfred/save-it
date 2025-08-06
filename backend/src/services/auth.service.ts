import { prisma } from "@/prisma";
import AppError from "@/utils/appError";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sanitizeUser } from "@/utils/sanitize";
import {
  LoginInput,
  loginSchema,
  ResetPasswordInput,
  resetPasswordSchema,
  SignupInput,
  signupSchema,
} from "@/validators/auth.schema";
import { Request } from "express";
import { sendEmail } from "@/utils/email";
import { resetPasswordTemplate } from "@/templates/resetPasswordEmail";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  iat?: number;
}

export const signUp = async (body: SignupInput) => {
  const { name, phoneNumber, password, email } = signupSchema.parse(body);

  const user = await prisma.user.create({
    data: { name, phoneNumber, password, email },
  });

  const token = generateToken(user.id);

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const login = async (body: LoginInput) => {
  const { phoneNumber, password } = loginSchema.parse(body);

  if (!phoneNumber || !password) {
    throw new AppError("Please provide Phone Number and Password", 400);
  }

  const user = await prisma.user.findUnique({
    where: { phoneNumber },
    omit: {
      password: false,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid phone number or password", 401);
  }

  const token = generateToken(user.id);

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const setPin = async (userId: string, pin: string) => {
  if (!pin) throw new AppError("No pin was provided", 400);

  const hashedPin = await bcrypt.hash(pin, 12);
  const user = await prisma.user.update({
    where: { id: userId },
    data: { pin: hashedPin },
  });

  if (!user) throw new AppError("User was not found", 404);

  return user;
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new AppError("User was not found", 404);

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: hashedResetToken,
      resetTokenExpiry,
    },
  });

  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
  try {
    await sendEmail({
      email,
      subject: "Your password reset link (valid for 10mins)",
      message: resetPasswordTemplate(resetLink),
    });
  } catch (err) {
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    throw new AppError(
      err instanceof Error ? err.message : "Failed to send email",
      500
    );
  }
};

export const resetPassword = async (
  body: ResetPasswordInput,
  token: string
) => {
  const { password } = resetPasswordSchema.parse(body);
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedResetToken,
      resetTokenExpiry: { gte: new Date() },
    },
  });

  if (!user) {
    throw new AppError("Token is invalid or has expired", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
};

export const verifyTokenAndUser = async (req: Request) => {
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

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY!
  ) as CustomJwtPayload;

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

  return sanitizeUser(user);
};

function generateToken(userId: string): string {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY not set in environment variables.");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || "1d",
  });
}
