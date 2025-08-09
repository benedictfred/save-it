import { prisma } from "../prisma/prisma";
import AppError from "../utils/appError";
import { User } from "@prisma/client";

export const getDashboard = async (user: Partial<User>) => {
  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    omit: {
      pin: false,
    },
  });

  const recentTransactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 5,
  });

  const recentNotifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return { currentUser, recentTransactions, recentNotifications };
};

export const resolveAccount = async (accountNumber: string) => {
  const user = await prisma.user.findUnique({
    where: { accountNumber },
    select: {
      id: true,
      name: true,
    },
  });

  if (!user) {
    throw new AppError("Recipient not found", 404);
  }

  return user;
};
