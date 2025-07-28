import { prisma } from "@/prisma";
import AppError from "@/utils/appError";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sanitizeUser } from "@/utils/sanitize";
import {
  LoginInput,
  SignupInput,
  signupSchema,
} from "@/validators/auth.schema";
import { Request } from "express";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  iat?: number;
}

export const signUp = async (body: any) => {
  const { name, phoneNumber, password, email }: SignupInput =
    signupSchema.parse(body);

  const user = await prisma.user.create({
    data: { name, phoneNumber, password, email, accountNumber: phoneNumber },
  });

  const token = generateToken(user.id);

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const login = async (body: LoginInput) => {
  const { phoneNumber, password } = body;

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

export const verifyTokenAndUser = async (req: Request) => {
  let token;

  if (
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
