import { Request, Response } from "express";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { OrderService } from "../services/order.service";
import { getUserIdFromToken } from "../middlewares/backend.middleware";

export class OrderController {

  private orderService : OrderService = new OrderService();
  
  async UpdateOrder(Req: Request, Res: Response) {
    try {

      let result = await this.orderService.UpdateOrder(Req.params.OrderId);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async DeleteOrder(Req: Request, Res: Response) {
    try {

      let result = await this.orderService.DeleteOrder(Req.params.OrderId);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetUserOrders(Req: Request, Res: Response) {
    try {

      let result = await this.orderService.GetUserOrders(getUserIdFromToken(Req));

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetAllOrders(Req: Request, Res: Response) {
    try {

      let result = await this.orderService.GetAllOrders();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetPaidOrders(Req: Request, Res: Response) {
    try {

      let result = await this.orderService.GetPaidOrders();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetUnpaidOrders(Req: Request, Res: Response) {
    try {

      let result = await this.orderService.GetUnpaidOrders();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetDeliveredOrders(Req: Request, Res: Response) {
    try {

      let result = await this.orderService.GetDeliveredOrders();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetUndeliveredOrders(Req: Request, Res: Response) {
    try {

      let result = await this.orderService.GetUndeliveredOrders();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  
}