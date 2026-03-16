import Expo, { ExpoPushMessage } from "expo-server-sdk";
import { prisma } from "../prisma/prisma";
import { sendEvent } from "../utils/ably";
import AppError from "../utils/appError";

const expo = new Expo();

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
  if (!Expo.isExpoPushToken(pushToken)) {
    throw new AppError(`Invalid Expo push token: ${pushToken}`, 400);
  }

  const messages: ExpoPushMessage[] = [
    {
      to: pushToken,
      sound: "default",
      title,
      body,
      data,
    },
  ];

  try {
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    return tickets;
  } catch (error) {
    console.error(`Failed to send push notification: ${error}`);
  }
}
