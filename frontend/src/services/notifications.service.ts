import axios from "axios";
import { BackendRoute } from "../shared/shared.data";
import { ServiceResult } from "../shared/service.result/service.result";
import { Notification } from "../interfaces/interfaces";

export class NotificationService {
  private static ApiUrl = `${BackendRoute}notification`;

  static async GetUserNotifications(): Promise<ServiceResult<Notification>> {
    const result = await axios.get(`${this.ApiUrl}/get-user-notifications`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Notification>;
  }

  static async DeleteNotification( 
    NotificationId: string
  ): Promise<ServiceResult<Notification>> {
    const result = await axios.delete(
      `${this.ApiUrl}/delete-notification/${NotificationId}`,
      { withCredentials: true }
    );
    return result.data as ServiceResult<Notification>;
  }

  static async MarkNotificationAsRead(
    NotificationId: string
  ): Promise<ServiceResult<Notification>> {
    const result = await axios.put(
      `${this.ApiUrl}/mark-notification-as-read/${NotificationId}`,
      {},
      { withCredentials: true }
    );
    return result.data as ServiceResult<Notification>;
  }
}