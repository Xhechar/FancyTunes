import { IOrderService } from "../interfaces/abstracts/services.abstracts";
import { Order, PrismaClient } from "@prisma/client";
import { CreateOrderDto, UpdateOrderDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";

export class OrderService implements IOrderService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateOrder(Order: CreateOrderDto): Promise<ServiceResult<Order>> {
    throw new Error("Method not implemented.");
  }
  async UpdateOrder(OrderId: string, Order: UpdateOrderDto): Promise<ServiceResult<Order>> {
    throw new Error("Method not implemented.");
  }
  async DeleteOrder(OrderId: string): Promise<ServiceResult<Order>> {
    throw new Error("Method not implemented.");
  }
  async GetUserOrders(UserId: string): Promise<ServiceResult<Order>> {
    throw new Error("Method not implemented.");
  }
  async GetAllOrders(): Promise<ServiceResult<Order>> {
    throw new Error("Method not implemented.");
  }
  async GetPaidOrders(): Promise<ServiceResult<Order>> {
    throw new Error("Method not implemented.");
  }
  async GetUnpaidOrders(): Promise<ServiceResult<Order>> {
    throw new Error("Method not implemented.");
  }
  async GetDeliveredOrders(): Promise<ServiceResult<Order>> {
    throw new Error("Method not implemented.");
  }
  async GetUndeliveredOrders(): Promise<ServiceResult<Order>> {
    throw new Error("Method not implemented.");
  }
}