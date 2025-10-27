import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { Request, Response } from "express";
import { CartService } from "../services/cart.service";
import { getUserIdFromToken } from "../middlewares/backend.middleware";

export class CartController {

  private cartService : CartService = new CartService();

  async CreateCart(Req: Request, Res: Response) {
    try {

      let result = await this.cartService.CreateCart(getUserIdFromToken(Req), Req.params.DelicacyId, Req.body);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async IncrementCartItem(Req: Request, Res: Response) {
    try {

      let result = await this.cartService.IncrementCartItem(getUserIdFromToken(Req), Req.params.CartId);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async DecrementCartItem(Req: Request, Res: Response) {
    try {

      let result = await this.cartService.DecrementCartItem(getUserIdFromToken(Req), Req.params.CartId);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async DeleteCart(Req: Request, Res: Response) {
    try {

      let result = await this.cartService.DeleteCart(getUserIdFromToken(Req), Req.params.CartId);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetUserCarts(Req: Request, Res: Response) {
    try {

      let result = await this.cartService.GetUserCarts(getUserIdFromToken(Req));
      
      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  
  async ClearCart(Req: Request, Res: Response) {
    try {
      let result = await this.cartService.ClearCart(getUserIdFromToken(Req));
      return Res.status(200).json(result);
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
}