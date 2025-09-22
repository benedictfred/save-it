import rateLimit from "express-rate-limit";

function createLimiter(windowMs: number, max: number, message?: string) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: message || "Too many requests, please try again later.",
  });
}

export const authLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  "Too many authentication attempts, please try again in 15 minutes."
);

export const passwordResetLimiter = createLimiter(
  60 * 60 * 1000,
  3,
  "Too many password reset requests, please try again in an hour."
);

export const emailVerificationLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  "Too many email verification requests, please try again in 15 minutes."
);

export const transactionLimiter = createLimiter(
  1 * 60 * 1000,
  10,
  "Transaction limit exceeded. Please wait before making another transaction."
);

export const readLimiter = createLimiter(1 * 60 * 1000, 50);

export const apiLimiter = createLimiter(5 * 60 * 1000, 100);
