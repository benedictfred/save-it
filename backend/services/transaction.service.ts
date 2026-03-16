import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/prisma";
import { sendEvent } from "../utils/ably";
import AppError from "../utils/appError";
import * as notificationService from "./notification.service";
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
    include: { devices: true },
  });

  if (!sender) throw new AppError("Sender not found", 404);

  if (sender.accountNumber === recipientAccNumber)
    throw new AppError("Cannot transfer to self", 400);

  const isCorrectPin = await bcrypt.compare(pin, sender.pin!);
  if (!isCorrectPin) throw new AppError("Incorrect PIN", 400);

  const recipient = await prisma.user.findUnique({
    where: { accountNumber: recipientAccNumber },
    include: { devices: true },
  });

  if (!recipient) throw new AppError("Recipient not found", 404);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Deduct sender
      await tx.user.update({
        where: { id: senderId, balance: { gte: amount } },
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
      const creditTx = await tx.transaction.create({
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

      return { debitTx, creditTx };
    });

    const sendBackgoundNotifications = async () => {
      try {
        // Send Notifications
        await Promise.all([
          notificationService.create({
            userId: sender.id,
            title: "Transfer Successful",
            body: `Your account was debited with ₦${amount} to ${recipient.name}.`,
            transactionId: result.debitTx.id,
          }),
          notificationService.create({
            userId: recipient.id,
            title: "Credit Alert",
            body: `Your account was credited with ₦${amount} from ${sender.name}.`,
            transactionId: result.creditTx.id,
          }),
        ]);

        // Send SSE event to sender
        sendEvent(sender.id, {
          event: "transaction",
          data: {
            type: "debit",
            transaction: result.debitTx,
          },
        });

        // Send SSE event to recipient
        sendEvent(recipient.id, {
          event: "transaction",
          data: {
            type: "credit",
            transaction: result.creditTx,
          },
        });

        // Send push notifications to all devices of sender and recipient
        for (const device of sender.devices) {
          await notificationService.sendPushNotification({
            pushToken: device.pushToken,
            title: "Transfer Successful",
            body: `Your account was debited with ₦${amount} to ${recipient.name}.`,
            data: {
              transactionId: result.debitTx.id,
            },
          });
        }

        for (const device of recipient.devices) {
          await notificationService.sendPushNotification({
            pushToken: device.pushToken,
            title: "Credit Alert",
            body: `Your account was credited with ₦${amount} from ${sender.name}.`,
            data: {
              transactionId: result.creditTx.id,
            },
          });
        }
      } catch (err) {
        console.log("Error sending background notifications:", err);
      }
    };

    sendBackgoundNotifications();

    return result.debitTx;
  } catch (err) {
    console.log(err);
    // log a failed transaction for the sender
    const failedTx = await prisma.transaction.create({
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

    let errorMessage: string;
    let statusCode: number;
    let messageBody: string;

    if (err instanceof AppError) {
      errorMessage = err.message;
      statusCode = err.statusCode;
      messageBody = `The transfer of ₦${amount} to ${recipient.name} failed due to ${err.message}`;
    } else if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      errorMessage = "Insufficient funds";
      statusCode = 400;
      messageBody = `The transfer of ₦${amount} to ${recipient.name} failed due to insufficient funds.`;
    } else {
      errorMessage = "Transaction Failed";
      statusCode = 500;
      messageBody = `The transfer of ₦${amount} to ${recipient.name} failed due to an unexpected error.`;
    }

    await notificationService.create({
      userId: sender.id,
      title: "Transfer Failed",
      body: messageBody,
      transactionId: failedTx.id,
    });

    // Send SSE event for failed transaction
    sendEvent(sender.id, {
      event: "transaction",
      data: {
        type: "debit",
        transaction: failedTx,
      },
    });

    // Send a push notification for failed transaction to all sender's devices
    for (const device of sender.devices) {
      await notificationService.sendPushNotification({
        pushToken: device.pushToken,
        title: "Transfer Failed",
        body: messageBody,
        data: {
          transactionId: failedTx.id,
        },
      });
    }

    throw new AppError(errorMessage, statusCode);
  }
}

export const getHistory = async (userId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return transactions;
};

export const getTransactionById = async (
  transactionId: string,
  userId: string,
) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });

  if (!transaction) throw new AppError("Transaction not found", 404);

  return transaction;
};
