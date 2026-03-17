import { prisma } from "../prisma/prisma";
import { sendEvent } from "../utils/ably";
import AppError from "../utils/appError";

interface SendPushNotificationParams {
  pushToken: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export async function create({
  userId,
  title,
  body,
  transactionId,
}: {
  userId: string;
  title: string;
  body: string;
  transactionId?: string;
}) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      title,
      body,
      ...(transactionId ? { transactionId } : {}),
    },
  });

  // Push to the user's SSE stream
  sendEvent(userId, {
    event: "notification",
    data: {
      id: notification.id,
      title: notification.title,
      body: notification.body,
      createdAt: notification.createdAt,
    },
  });

  return notification;
}

export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function deleteNotification(id: string, userId: string) {
  return prisma.notification.deleteMany({
    where: { id, userId },
  });
}

export async function sendPushNotification({
  pushToken,
  title,
  body,
  data,
}: SendPushNotificationParams) {
  if (!pushToken || !pushToken.startsWith("ExponentPushToken[")) {
    throw new AppError(`Invalid Expo push token: ${pushToken}`, 400);
  }

  const message = {
    to: pushToken,
    sound: "default",
    title,
    body,
    data,
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const receipt = await response.json();
    return receipt;
  } catch (error) {
    console.error(`Failed to send push notification: ${error}`);
  }
}
