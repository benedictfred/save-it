import { prisma } from "@/prisma";
import { sendEvent } from "@/utils/sse";

export async function create({
  userId,
  title,
  body,
}: {
  userId: string;
  title: string;
  body: string;
}) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      title,
      body,
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
