import { prisma } from "@/prisma";
import AppError from "@/utils/appError";
import bcrypt from "bcrypt";

export async function transfer({
  senderId,
  recipientAccNumber,
  amount,
  pin,
}: {
  senderId: string;
  recipientAccNumber: string;
  amount: number;
  pin: string;
}) {
  if (amount <= 0) throw new AppError("Invalid transfer amount", 400);

  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    omit: {
      pin: false,
    },
  });

  if (!sender) throw new AppError("Sender not found", 404);

  if (sender.accountNumber === recipientAccNumber)
    throw new AppError("Cannot transfer to self", 400);

  const isCorrectPin = bcrypt.compare(pin, sender.pin!);
  if (!isCorrectPin) throw new AppError("Incorrect PIN", 401);

  const recipient = await prisma.user.findUnique({
    where: { accountNumber: recipientAccNumber },
  });

  if (!recipient) throw new AppError("Recipient not found", 404);

  try {
    if (sender.balance < amount)
      throw new AppError("Insufficient balance", 400);

    const result = await prisma.$transaction(async (tx) => {
      // Deduct sender
      await tx.user.update({
        where: { id: senderId },
        data: { balance: { decrement: amount } },
      });

      // Credit recipient
      await tx.user.update({
        where: { id: recipient.id },
        data: { balance: { increment: amount } },
      });

      // Log debit
      const debitTx = await tx.transaction.create({
        data: {
          amount,
          date: new Date(),
          type: "debit",
          status: "success",
          senderName: sender.name,
          senderAccNumber: sender.accountNumber,
          recipientName: recipient.name,
          recipientAccNumber: recipient.accountNumber,
          userId: sender.id,
        },
      });

      // Log credit
      await tx.transaction.create({
        data: {
          amount,
          date: new Date(),
          type: "credit",
          status: "success",
          senderName: sender.name,
          senderAccNumber: sender.accountNumber,
          recipientName: recipient.name,
          recipientAccNumber: recipient.accountNumber,
          userId: recipient.id,
        },
      });

      return debitTx;
    });

    return result;
  } catch (err) {
    // log a failed transaction for the sender
    await prisma.transaction.create({
      data: {
        amount,
        date: new Date(),
        type: "debit",
        status: "failed",
        senderName: sender.name,
        senderAccNumber: sender.accountNumber,
        recipientName: recipient.name,
        recipientAccNumber: recipient.accountNumber,
        userId: sender.id,
      },
    });

    throw new AppError(
      err instanceof AppError ? err.message : "Transaction Failed",
      err instanceof AppError ? err.statusCode : 500
    );
  }
}

export const getHistory = async (userId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return transactions;
};
