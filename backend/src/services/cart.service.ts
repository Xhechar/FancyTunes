import { ICartService } from "../interfaces/abstracts/services.abstracts";
import { Cart, PrismaClient } from "@prisma/client";
import { CreateCartDto, UpdateCartDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";

export class CartService implements ICartService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateCart(Cart: CreateCartDto): Promise<ServiceResult<Cart>> {
    throw new Error("Method not implemented.");
  }
  async UpdateCart(CartId: string, Cart: UpdateCartDto): Promise<ServiceResult<Cart>> {
    throw new Error("Method not implemented.");
  }
  async IncrementCartItem(CartId: string): Promise<ServiceResult<Cart>> {
    throw new Error("Method not implemented.");
  }
  async DecrementCartItem(CartId: string): Promise<ServiceResult<Cart>> {
    throw new Error("Method not implemented.");
  }
  async DeleteCart(CartId: string): Promise<ServiceResult<Cart>> {
    throw new Error("Method not implemented.");
  }
  async GetUserCarts(UserId: string): Promise<ServiceResult<Cart>> {
    throw new Error("Method not implemented.");
  }
  async GetAllCarts(): Promise<ServiceResult<Cart>> {
    throw new Error("Method not implemented.");
  }  
}