import { Request, Response } from "express";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { NotificationsService } from "../services/notifications.service";
import { getUserIdFromToken } from "../middlewares/backend.middleware";

export class NotificationController {
  
  private notificationService: NotificationsService = new NotificationsService();

  async GetUserNotifications(Req: Request, Res: Response) {
    try {

      let result = await this.notificationService.GetUserNotifications(getUserIdFromToken(Req));

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async DeleteNotification(Req: Request, Res: Response) {
    try {

      let result = await this.notificationService.DeleteNotification(Req.params.NotificationId);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async MarkNotificationAsRead(Req: Request, Res: Response) {
    try {

      let result = await this.notificationService.MarkNotificationAsRead(Req.params.NotificationId);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  
}