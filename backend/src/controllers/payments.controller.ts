import { Request, Response } from "express";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { PaymentService } from "../services/payments.service";
import { ExtendedRequest, getUserIdFromToken } from "../middlewares/backend.middleware";

export class PaymentController {

  private paymentService : PaymentService = new PaymentService();

  async CreatePayment(Req: Request, Res: Response) {
    try {

      let result = await this.paymentService.CreatePayment(
        getUserIdFromToken(Req as ExtendedRequest),
        Req.params.CommodityId as string,
        Req.body,
      );

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }

  async GetUserPayments(Req: Request, Res: Response) {
    try {

      let result = await this.paymentService.GetUserPayments(getUserIdFromToken(Req as ExtendedRequest));

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetAllPayments(Req: Request, Res: Response) {
    try {

      let result = await this.paymentService.GetAllPayments();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async DeletePayment(Req: Request, Res: Response) {
    try {

      let result = await this.paymentService.DeletePayment(
        Req.params.PaymentId as string,
      );

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async MpesaCallback(Req: Request, Res: Response) {
    try {

      let result = await this.paymentService.MpesaCallback(Req.body);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  
}