import { prisma } from "../prisma/prisma";
import AppError from "../utils/appError";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sanitizeUser } from "../utils/sanitize";
import {
  LoginDto,
  loginSchema,
  pinSchema,
  ResetPasswordDto,
  resetPasswordSchema,
  SignupDto,
  signupSchema,
  UpdatePasswordDto,
  updatePasswordSchema,
  UpdatePinDto,
  updatePinSchema,
} from "../validators/auth.schema";
import { sendEmail } from "../utils/email";
import { resetPasswordTemplate } from "../templates/resetPasswordEmail";
import {
  generateOTP,
  generateRandomToken,
  hashToken,
} from "../utils/generateToken";
import { verifyEmailTemplate } from "../templates/verifyAccoutEmail";
import { verifyEmailOtpTemplate } from "../templates/verifyAccountOtpEmail";
import { signToken } from "../utils/jwt";
import { generateAccountNumber } from "../utils/generateAccNumber";
import { verifyIdToken } from "../utils/firebaseAdmin";
import { resetPasswordOtpTemplate } from "../templates/resetPasswordOtpEmail";
import { User } from "@prisma/client";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

export const signUp = async (body: SignupDto) => {
  const { name, password, email, client } = signupSchema.parse(body);

  const accountNumber = await generateAccountNumber();

  const user = await prisma.user.create({
    data: { name, password, email, accountNumber },
  });

  const token = signToken(user.id, "20m");

  await sendVerificationEmail(user.id, client);

  return {
    user: sanitizeUser(user),
    message: "Account created successfully, verification email has been sent.",
    token,
  };
};

export const login = async (body: LoginDto) => {
  const { email, password, client } = loginSchema.parse(body);

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

  if (user.status === "pending") {
    await sendVerificationEmail(user.id, client);
    token = signToken(user.id, "20m");
  } else {
    token = signToken(user.id);
  }

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

  const token = signToken(newUser.id);

  return {
    user: sanitizeUser(newUser),
    token,
    isNewUser: true,
  };
};

export const setPin = async (userId: string, pinInput: string) => {
  const { pin } = pinSchema.parse(pinInput);

  if (!pin) throw new AppError("No pin was provided", 400);

  const hashedPin = await bcrypt.hash(pin, 12);
  const user = await prisma.user.update({
    where: { id: userId },
    data: { pin: hashedPin },
  });

  if (!user) throw new AppError("User was not found", 404);

  return user;
};

export const forgotPassword = async (
  email: string,
  client: "web" | "mobile" = "web",
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new AppError("User was not found", 404);

  let rawToken: string;
  let emailMessage: string;

  if (client === "mobile") {
    rawToken = generateOTP();
    emailMessage = resetPasswordOtpTemplate(rawToken);
  } else {
    rawToken = crypto.randomBytes(32).toString("hex");
    const resetLink = `${frontendUrl}/reset-password/${rawToken}`;
    emailMessage = resetPasswordTemplate(resetLink);
  }

  const hashedResetToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

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

  try {
    await sendEmail({
      email,
      subject:
        client === "mobile"
          ? "Your password reset OTP (valid for 10mins)"
          : "Your password reset link (valid for 10mins)",
      message: emailMessage,
    });
  } catch (err) {
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });
    throw new AppError(
      err instanceof Error ? err.message : "Failed to send email",
      500,
    );
  }
};

export const validateResetOtp = async (otp: string) => {
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const validToken = await prisma.verificationToken.findFirst({
    where: {
      token: hashedOtp,
      type: "password_reset",
      expiresAt: { gt: new Date() },
    },
    include: {
      user: true,
    },
  });

  if (!validToken) {
    throw new AppError("Invalid or expired Otp", 400);
  }

  const sessionToken = crypto.randomBytes(32).toString("hex");
  const hashedSessionToken = crypto
    .createHash("sha256")
    .update(sessionToken)
    .digest("hex");

  await prisma.verificationToken.create({
    data: {
      userId: validToken.user.id,
      type: "password_reset_session",
      token: hashedSessionToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  await prisma.verificationToken.delete({ where: { id: validToken.id } });

  return {
    resetSessionToken: sessionToken,
  };
};

export const resetPassword = async (body: ResetPasswordDto) => {
  const { password, token } = resetPasswordSchema.parse(body);

  if (!token) {
    throw new AppError("Token is required", 400);
  }

  const hashedResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      verificationTokens: {
        some: {
          token: hashedResetToken,
          type: { in: ["password_reset", "password_reset_session"] },
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
      type: { in: ["password_reset", "password_reset_session"] },
    },
  });
};

export const sendVerificationEmail = async (
  userId: string,
  client: "web" | "mobile" = "web",
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const rawToken = client === "mobile" ? generateOTP() : generateRandomToken();
  const hashedEmailToken = hashToken(rawToken);

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

  const verificationLink = `${frontendUrl}/verify-email/${rawToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject:
        client === "mobile" ? "Email Verification OTP" : "Email Verification",
      message:
        client === "mobile"
          ? verifyEmailOtpTemplate(user.name, rawToken)
          : verifyEmailTemplate(user.name, verificationLink),
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
      500,
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
    userStatus: verifiedUser.status,
  };
};

export const updatePassword = async (
  payload: UpdatePasswordDto,
  user: User,
) => {
  const { currentPassword, newPassword } = updatePasswordSchema.parse(payload);

  const userToUpdate = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, password: true },
  });

  if (!userToUpdate || !userToUpdate.password) {
    throw new AppError("User not found or password not set", 400);
  }

  const isCurrentPasswordCorrect = await bcrypt.compare(
    currentPassword,
    userToUpdate.password,
  );

  if (!isCurrentPasswordCorrect) {
    throw new AppError("Current password is not correct", 400);
  }

  if (currentPassword === newPassword) {
    throw new AppError(
      "New password must be different from current password",
      400,
    );
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userToUpdate.id },
    data: { password: hashedNewPassword, passwordChangedAt: new Date() },
  });
};

export const updatePin = async (payload: UpdatePinDto, user: User) => {
  const { currentPin, newPin } = updatePinSchema.parse(payload);

  const userToUpdate = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, pin: true },
  });

  if (!userToUpdate || !userToUpdate.pin) {
    throw new AppError("User not found or pin not set", 400);
  }

  const isCurrentPinCorrect = await bcrypt.compare(
    currentPin,
    userToUpdate.pin,
  );

  if (!isCurrentPinCorrect) {
    throw new AppError("Current pin is not correct", 400);
  }

  if (currentPin === newPin) {
    throw new AppError("New pin must be different from current pin", 400);
  }

  const hashedNewPin = await bcrypt.hash(newPin, 12);

  await prisma.user.update({
    where: { id: userToUpdate.id },
    data: { pin: hashedNewPin },
  });
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
