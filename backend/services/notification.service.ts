import { prisma } from "../prisma/prisma";
import { sendEvent } from "../utils/ably";
import AppError from "../utils/appError";

type ExpoModule = typeof import("expo-server-sdk");

let expoModulePromise: Promise<ExpoModule> | null = null;
let expoClient: any = null;

const getExpoModule = async () => {
  if (!expoModulePromise) {
    expoModulePromise = import("expo-server-sdk");
  }
  return expoModulePromise;
};

const getExpoClient = async () => {
  const module = await getExpoModule();
  const ExpoClient = module.default;

  if (!expoClient) {
    expoClient = new ExpoClient();
  }

  return { ExpoClient, expoClient };
};

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
  const { ExpoClient, expoClient } = await getExpoClient();

  if (!ExpoClient.isExpoPushToken(pushToken)) {
    throw new AppError(`Invalid Expo push token: ${pushToken}`, 400);
  }

  const messages = [
    {
      to: pushToken,
      sound: "default",
      title,
      body,
      data,
    },
  ];

  try {
    const chunks = expoClient.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expoClient.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    return tickets;
  } catch (error) {
    console.error(`Failed to send push notification: ${error}`);
  }
}
