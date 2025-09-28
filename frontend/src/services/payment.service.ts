import axios from "axios";
import { BackendRoute } from "../shared/shared.data";
import { ServiceResult } from "../shared/service.result/service.result";
import { CreatePaymentData, Payment } from "../interfaces/interfaces";
import { CreatePaymentDto } from "../interfaces/dtos/interfaces.dtos";

export class PaymentService {
  private static ApiUrl = `${BackendRoute}payment`;

  static async CreatePayment(
    CommodityId: string,
    Payment: CreatePaymentData
  ): Promise<ServiceResult<Payment>> {
    const result = await axios.post(
      `${this.ApiUrl}/create-payment/${CommodityId}`,
      Payment,
      { withCredentials: true }
    );
    return result.data as ServiceResult<Payment>;
  }

  static async GetUserPayments(): Promise<ServiceResult<Payment[]>> {
    const result = await axios.get(`${this.ApiUrl}/get-user-payments`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Payment[]>;
  }

  static async GetAllPayments(): Promise<ServiceResult<Payment[]>> {
    const result = await axios.get(`${this.ApiUrl}/get-all-payments`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Payment[]>;
  }

  static async DeletePayment(
    PaymentId: string
  ): Promise<ServiceResult<Payment>> {
    const result = await axios.delete(
      `${this.ApiUrl}/delete-payment/${PaymentId}`,
      { withCredentials: true }
    );
    return result.data as ServiceResult<Payment>;
  }

}
