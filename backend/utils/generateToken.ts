import crypto from "crypto";

export function generateRandomToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function hashOTP(otp: string) {
  const OTP_SECRET = process.env.OTP_SECRET;

  return crypto
    .createHash("sha256")
    .update(otp + OTP_SECRET)
    .digest("hex");
}
