import { IOrderService } from "../interfaces/abstracts/services.abstracts";
import { Order, PrismaClient } from "@prisma/client";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { v4 } from "uuid";
import { EmitToSingleUser } from "../sockets/socket.io";
import { io } from "../server";

export class OrderService implements IOrderService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateOrder(UserId: string): Promise<ServiceResult<Order>> {

    //do some payment stuff here later
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (!UserExists) return ServiceResponse.failure<Order>(ErrorCode.NOTFOUND, "your details are not availabele, kindly register.");

    let CartItems = await this.prisma.cart.findMany({
      where: {
        UserId
      },
      include: {
        Delicacy: true
      }
    });

    if (CartItems.length < 1) return ServiceResponse.failure<Order>(ErrorCode.NOTFOUND, "you have no items in your cart");

    let CreateOrders = await this.prisma.order.createMany({
      data: CartItems.map(item => {
        return {
          OrderId: v4(),
          UserId,
          DelicacyId: item.DelicacyId,
          Quantity: item.Quantity,
          TotalAmount: Number(item.Delicacy.Price) * item.Quantity
        }
      })
    });

    if (!CreateOrders) return ServiceResponse.failure<Order>(ErrorCode.SERVER, "unable to place order at the moment, try again later");

    await this.prisma.cart.deleteMany({
      where: {
        UserId
      }
    });

    EmitToSingleUser(io, UserId, "order-created", CreateOrders);

    return ServiceResponse.success<Order>("order placed successfully");
  }
  async UpdateOrder(OrderId: string): Promise<ServiceResult<Order>> {
    
    let OrderExists = await this.prisma.order.findUnique({
      where: {
        OrderId
      }
    });

    if (!OrderExists) return ServiceResponse.failure<Order>(ErrorCode.NOTFOUND, "the specified order does not exist");

    let UpdateOrder = await this.prisma.order.update({
      where: {
        OrderId
      },
      data: {
        OrderStatus: "delivered",
        DeliveredAt: new Date(),
        PaymentStatus: "paid"
      }
    });

    if (!UpdateOrder) return ServiceResponse.failure<Order>(ErrorCode.SERVER, "unable to update order at the moment");

    EmitToSingleUser(io, OrderExists.UserId, "order-updated", UpdateOrder);

    return ServiceResponse.success<Order>("order updated successfully");
  }
  async DeleteOrder(OrderId: string): Promise<ServiceResult<Order>> {
    
    let OrderExists = await this.prisma.order.findUnique({
      where: {
        OrderId
      }
    });

    if (!OrderExists) return ServiceResponse.failure<Order>(ErrorCode.NOTFOUND, "the specified order does not exist");

    let DeleteOrder = await this.prisma.order.delete({
      where: {
        OrderId
      }
    });

    if (!DeleteOrder) return ServiceResponse.failure<Order>(ErrorCode.SERVER, "unable to delete order at the moment");

    EmitToSingleUser(io, DeleteOrder.UserId, "order-deleted", DeleteOrder);

    return ServiceResponse.success<Order>("order deleted successfully");
  }
  async GetUserOrders(UserId: string): Promise<ServiceResult<Order>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (!UserExists) return ServiceResponse.failure<Order>(ErrorCode.NOTFOUND, "your details are unavailable at the moment.");

    let Orders = await this.prisma.order.findMany({
      where: {
        UserId
      },
      include: {
        Delicacy: true,
        OrderItems: true
      },
      orderBy: {
        OrderedAt: "desc"
      }
    });

    if (!Orders) return ServiceResponse.failure<Order>(ErrorCode.SERVER, "unable to fetch your orders at the moment");

    return ServiceResponse.success<Order>("your orders fetched successfully", undefined, Orders);
  }
  async GetAllOrders(): Promise<ServiceResult<Order>> {
    
    let Orders = await this.prisma.order.findMany({
      include: {
        Delicacy: true,
        User: true,
        OrderItems: true
      },
      orderBy: {
        OrderedAt: "desc"
      }
    });

    if (!Orders) return ServiceResponse.failure<Order>(ErrorCode.SERVER, "unable to fetch orders at the moment");

    return ServiceResponse.success<Order>("orders fetched successfully", undefined, Orders);
  }
  async GetPaidOrders(): Promise<ServiceResult<Order>> {
    
    let Orders = await this.prisma.order.findMany({
      where: {
        PaymentStatus: "paid"
      },
      include: {
        Delicacy: true,
        User: true,
        OrderItems: true
      },
      orderBy: {
        OrderedAt: "desc"
      }
    });

    if (!Orders) return ServiceResponse.failure<Order>(ErrorCode.SERVER, "unable to fetch paid orders at the moment");

    return ServiceResponse.success<Order>("paid orders fetched successfully", undefined, Orders);
  }
  async GetUnpaidOrders(): Promise<ServiceResult<Order>> {
    
    let Orders = await this.prisma.order.findMany({
      where: {
        PaymentStatus: "unpaid"
      },
      include: {
        Delicacy: true,
        User: true,
        OrderItems: true
      },
      orderBy: {
        OrderedAt: "desc"
      }
    });

    if (!Orders) return ServiceResponse.failure<Order>(ErrorCode.SERVER, "unable to fetch unpaid orders at the moment");

    return ServiceResponse.success<Order>("unpaid orders fetched successfully", undefined, Orders);
  }
  async GetDeliveredOrders(): Promise<ServiceResult<Order>> {
    
    let Orders = await this.prisma.order.findMany({
      where: {
        OrderStatus: "delivered"
      },
      include: {
        Delicacy: true,
        User: true,
        OrderItems: true
      },
      orderBy: {
        OrderedAt: "desc"
      }
    });

    if (!Orders) return ServiceResponse.failure<Order>(ErrorCode.SERVER, "unable to fetch delivered orders at the moment");

    return ServiceResponse.success<Order>("delivered orders fetched successfully", undefined, Orders);
  }
  async GetUndeliveredOrders(): Promise<ServiceResult<Order>> {
    
    let Orders = await this.prisma.order.findMany({
      where: {
        OrderStatus: "pending"
      },
      include: {
        Delicacy: true,
        User: true,
        OrderItems: true
      },
      orderBy: {
        OrderedAt: "desc"
      }
    });

    if (!Orders) return ServiceResponse.failure<Order>(ErrorCode.SERVER, "unable to fetch undelivered orders at the moment");

    return ServiceResponse.success<Order>("undelivered orders fetched successfully", undefined, Orders);
  }
}