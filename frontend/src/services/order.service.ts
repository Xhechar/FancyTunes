import axios from "axios";
import { BackendRoute } from "../shared/shared.data";
import { ServiceResult } from "../shared/service.result/service.result";
import { Order } from "../interfaces/interfaces";

export class OrderService {
  private static ApiUrl = `${BackendRoute}order`;

  static async UpdateOrder(
    OrderId: string,
  ): Promise<ServiceResult<Order>> {
    const result = await axios.put(
      `${this.ApiUrl}/update-order/${OrderId}`,
      { withCredentials: true }
    );
    return result.data as ServiceResult<Order>; 
  }

  static async DeleteOrder(OrderId: string): Promise<ServiceResult<Order>> {
    const result = await axios.delete(
      `${this.ApiUrl}/delete-order/${OrderId}`,
      { withCredentials: true }
    );
    return result.data as ServiceResult<Order>;
  }

  static async GetUserOrders(): Promise<ServiceResult<Order>> {
    const result = await axios.get(`${this.ApiUrl}/get-user-orders`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Order>;
  }

  static async GetAllOrders(): Promise<ServiceResult<Order>> {
    const result = await axios.get(`${this.ApiUrl}/get-all-orders`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Order>;
  }

  static async GetPaidOrders(): Promise<ServiceResult<Order>> {
    const result = await axios.get(`${this.ApiUrl}/get-paid-orders`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Order>;
  }

  static async GetUnpaidOrders(): Promise<ServiceResult<Order>> {
    const result = await axios.get(`${this.ApiUrl}/get-unpaid-orders`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Order>;
  }

  static async GetDeliveredOrders(): Promise<ServiceResult<Order>> {
    const result = await axios.get(`${this.ApiUrl}/get-delivered-orders`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Order>;
  }

  static async GetUndeliveredOrders(): Promise<ServiceResult<Order>> {
    const result = await axios.get(`${this.ApiUrl}/get-undelivered-orders`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Order>;
  }
}
