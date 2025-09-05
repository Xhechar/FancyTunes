import { Payment, PrismaClient } from "@prisma/client";
import { IPaymentService } from "../interfaces/abstracts/services.abstracts";
import { CreatePaymentDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";

export class PaymentService implements IPaymentService {

  private prisma = new PrismaClient({
    log: ["error"]
  });
  
  async CreatePayment(Payment: CreatePaymentDto): Promise<ServiceResult<Payment>> {
    throw new Error("Method not implemented.");
  }
  async GetUserPayments(UserId: string): Promise<ServiceResult<Payment>> {
    throw new Error("Method not implemented.");
  }
  async GetAllPayments(): Promise<ServiceResult<Payment>> {
    throw new Error("Method not implemented.");
  }
  async DeletePayment(PaymentId: string): Promise<ServiceResult<Payment>> {
    throw new Error("Method not implemented.");
  }
}