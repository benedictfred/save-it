import { prisma } from "../prisma/prisma";
import AppError from "../utils/appError";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sanitizeUser } from "../utils/sanitize";
import {
  LoginInput,
  loginSchema,
  ResetPasswordInput,
  resetPasswordSchema,
  SignupInput,
  signupSchema,
} from "../validators/auth.schema";
import { sendEmail } from "../utils/email";
import { resetPasswordTemplate } from "../templates/resetPasswordEmail";
import { generateRandomToken, hashToken } from "../utils/generateToken";
import { verifyEmailTemplate } from "../templates/verifyAccoutEmail";
import { signToken } from "../utils/jwt";
import { generateAccountNumber } from "../utils/generateAccNumber";
import { verifyIdToken } from "../utils/firebaseAdmin";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

export const signUp = async (body: SignupInput) => {
  const { name, password, email } = signupSchema.parse(body);

  const accountNumber = await generateAccountNumber();

  const user = await prisma.user.create({
    data: { name, password, email, accountNumber },
  });

  const token = signToken(user.id, "20m");

  return {
    user: sanitizeUser(user),
    message: "Account created successfully.",
    token,
  };
};

export const login = async (body: LoginInput) => {
  const { email, password } = loginSchema.parse(body);

  if (!email || !password) {
    throw new AppError("Please provide Email and Password", 400);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    omit: {
      password: false,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid phone number or password", 401);
  }

  let token;

  user.status === "pending"
    ? (token = signToken(user.id, "20m"))
    : (token = signToken(user.id));

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const googleAuth = async (idToken: string) => {
  const decodedToken = await verifyIdToken(idToken);

  if (!decodedToken.email) {
    throw new AppError("Email not found in Google account", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: decodedToken.email },
  });

  if (existingUser) {
    const token =
      existingUser.status === "pending"
        ? signToken(existingUser.id, "20m")
        : signToken(existingUser.id);

    return {
      user: sanitizeUser(existingUser),
      token,
      isNewUser: false,
    };
  }

  const accountNumber = await generateAccountNumber();
  const randomPassword = crypto.randomBytes(32).toString("hex");
  const hashedPassword = await bcrypt.hash(randomPassword, 12);

  const newUser = await prisma.user.create({
    data: {
      name: decodedToken.name || "User",
      email: decodedToken.email,
      password: hashedPassword,
      accountNumber,
      emailVerified: true,
      status: "active",
    },
  });

  const token = signToken(newUser.id, "20m");

  return {
    user: sanitizeUser(newUser),
    token,
    isNewUser: true,
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

  await prisma.verificationToken.deleteMany({
    where: {
      userId: user.id,
      type: "password_reset",
    },
  });

  const verificationToken = await prisma.verificationToken.upsert({
    where: {
      userId_type: { userId: user.id, type: "password_reset" },
    },
    update: {
      token: hashedResetToken,
      expiresAt: resetTokenExpiry,
    },
    create: {
      userId: user.id,
      type: "password_reset",
      token: hashedResetToken,
      expiresAt: resetTokenExpiry,
    },
  });

  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;
  try {
    await sendEmail({
      email,
      subject: "Your password reset link (valid for 10mins)",
      message: resetPasswordTemplate(resetLink),
    });
  } catch (err) {
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
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
      verificationTokens: {
        some: {
          token: hashedResetToken,
          type: "password_reset",
          expiresAt: { gt: new Date() },
        },
      },
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
    },
  });

  await prisma.verificationToken.deleteMany({
    where: {
      userId: user.id,
      type: "password_reset",
    },
  });
};

export const sendVerificationEmail = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const emailToken = generateRandomToken();
  const hashedEmailToken = hashToken(emailToken);

  await prisma.verificationToken.upsert({
    where: {
      userId_type: { userId, type: "email" },
    },
    update: {
      token: hashedEmailToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    create: {
      userId: user.id,
      type: "email",
      token: hashedEmailToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const verificationLink = `${frontendUrl}/verify-email/${emailToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Email Verification",
      message: verifyEmailTemplate(user.name, verificationLink),
    });
    return { message: "Verification email sent successfully" };
  } catch (err) {
    await prisma.verificationToken.deleteMany({
      where: {
        userId: user.id,
        type: "email",
      },
    });
    throw new AppError(
      err instanceof Error ? err.message : "Failed to send email",
      500
    );
  }
};

export const verifyEmail = async (token: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const verifiedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirst({
      where: {
        verificationTokens: {
          some: {
            token: hashedToken,
            type: "email",
            expiresAt: { gt: new Date() },
          },
        },
      },
    });

    if (!user) {
      throw new AppError("Token is invalid or has expired", 400);
    }

    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: { emailVerified: true, status: "active" },
    });

    await tx.verificationToken.deleteMany({
      where: {
        userId: user.id,
        type: "email",
      },
    });

    return updatedUser;
  });

  const accessToken = signToken(verifiedUser.id);

  return {
    message: "Email verified successfully",
    newToken: accessToken,
  };
};

// export const sendPhoneVerificationOTP = async (userId: string) => {
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user) {
//     throw new AppError("User not found", 404);
//   }

//   if (user.phoneVerified) {
//     throw new AppError("Phone number already verified", 400);
//   }

//   const otp = generateOTP();
//   const hashedOtp = hashOTP(otp);
//   const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//   // Update existing OTP token or create a new one
//   await prisma.verificationToken.upsert({
//     where: {
//       userId_type: { userId, type: "phone" },
//     },
//     update: {
//       token: hashedOtp,
//       expiresAt: otpExpiry,
//     },
//     create: {
//       userId,
//       type: "phone",
//       token: hashedOtp,
//       expiresAt: otpExpiry,
//     },
//   });

//   // Send SMS
//   await sendSMS(user.phoneNumber, otp);

//   return {
//     message: "OTP sent successfully and expires in 10 minutes",
//   };
// };

// export const verifyPhoneOTP = async (userId: string, otp: string) => {
//   const hashedOtp = hashOTP(otp);
//   const user = await prisma.user.findFirst({
//     where: {
//       id: userId,
//       verificationTokens: {
//         some: {
//           token: hashedOtp,
//           type: "phone",
//           expiresAt: { gt: new Date() },
//         },
//       },
//     },
//   });

//   if (!user) {
//     throw new AppError("Invalid OTP or OTP has expired", 400);
//   }

//   await prisma.$transaction(async (tx) => {
//     // Here I am setting the status to active because email must
//     // be verified before phone

//     await tx.user.update({
//       where: { id: userId },
//       data: { phoneVerified: true, status: "active" },
//     });

//     await tx.verificationToken.deleteMany({
//       where: {
//         userId,
//         type: "phone",
//       },
//     });
//   });

//   const token = signToken(userId);

//   return {
//     token,
//     message: "Phone number verified successfully",
//   };
// };
