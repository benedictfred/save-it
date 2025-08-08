import { User } from "@prisma/client";

export function sanitizeUser(user: Partial<User>) {
  const { password, pin, passwordChangedAt, ...safeUser } = user;
  return safeUser;
}
