import { PrismaClient } from "@prisma/client";
import { CreateNotificationDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { Notification } from "@prisma/client";
import { INotificationService } from "../interfaces/abstracts/services.abstracts";

export class NotificationsService implements INotificationService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async SendNotification(Notification: CreateNotificationDto): Promise<ServiceResult<globalThis.Notification>> {
    throw new Error("Method not implemented.");
  }
  async GetUserNotifications(UserId: string): Promise<ServiceResult<globalThis.Notification>> {
    throw new Error("Method not implemented.");
  }
  async DeleteNotification(NotificationId: string): Promise<ServiceResult<globalThis.Notification>> {
    throw new Error("Method not implemented.");
  }
  async MarkNotificationAsRead(NotificationId: string): Promise<ServiceResult<globalThis.Notification>> {
    throw new Error("Method not implemented.");
  }
}