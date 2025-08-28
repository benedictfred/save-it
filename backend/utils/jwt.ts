import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  iat?: number;
}

export function signToken(userId: string, expiresIn?: string | number) {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY not set in environment variables.");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: expiresIn || (process.env.JWT_EXPIRES_IN as any),
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY!);
}
