import * as notificationService from "@/services/notification.service";
import catchAsync from "@/utils/catchAsync";
import { addClient } from "@/utils/sse";
import { NextFunction, Request, Response } from "express";

export const createNotification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, body } = req.body;
    const userId = req.user!.id!;

    const notification = await notificationService.create({
      userId,
      title,
      body,
    });
    res.status(201).json({ status: "success", notification });
  }
);

export const getUserNotifications = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id!;
    const notifications = await notificationService.getUserNotifications(
      userId
    );
    res.status(200).json({ status: "success", notifications });
  }
);

export const markAllAsRead = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id!;
    await notificationService.markAllAsRead(userId);
    res.status(200).json({ message: "All notifications marked as read." });
  }
);

export const deleteNotification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id!;
    const { id } = req.params;
    await notificationService.deleteNotification(id, userId);
    res.status(204).json({ message: "Notification deleted." });
  }
);

export const notificationEventHandler = (req: Request, res: Response) => {
  addClient(req.user?.id!, req, res);
};
