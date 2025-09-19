import { Router } from "express";
import { verifyToken, verifyUser } from "../middlewares/backend.middleware";
import { NotificationController } from "../controllers/notifications.controller";

export const NotificationRouter = Router();

const notificationController: NotificationController =
  new NotificationController();

NotificationRouter.get(
  "/get-user-notifications",
  verifyToken,
  verifyUser,
  async (Req, Res) =>
    await notificationController.GetUserNotifications(Req, Res)
);

NotificationRouter.delete(
  "/delete-notification/:NotificationId",
  verifyToken,
  verifyUser,
  async (Req, Res) => await notificationController.DeleteNotification(Req, Res)
);

NotificationRouter.put(
  "/mark-notification-as-read/:NotificationId",
  verifyToken,
  verifyUser,
  async (Req, Res) =>
    await notificationController.MarkNotificationAsRead(Req, Res)
);
