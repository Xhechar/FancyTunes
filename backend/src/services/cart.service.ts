import { ICartService } from "../interfaces/abstracts/services.abstracts";
import { Cart, PrismaClient } from "@prisma/client";
import { CreateCartDto, UpdateCartDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { v4 } from "uuid";
import { io } from "../server";
import { EmitToSingleUser } from "../sockets/socket.io";

export class CartService implements ICartService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateCart(UserId: string, DelicacyId: string, Cart: CreateCartDto): Promise<ServiceResult<Cart>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (!UserExists) return ServiceResponse.failure<Cart>(ErrorCode.NOTFOUND, "your details are not availabele, kindly register.");

    let DelicacyExists = await this.prisma.delicacy.findUnique({
      where: {
        DelicacyId,
        IsAvailable: true
      }
    });

    if (!DelicacyExists) return ServiceResponse.failure<Cart>(ErrorCode.NOTFOUND, "the delicacy you are trying to add is not available at the moment");

    let AddToCart = await this.prisma.cart.create({
      data: {
        CartId: v4(),
        UserId,
        DelicacyId,
        ...Cart
      }
    });

    if (!AddToCart) return ServiceResponse.failure<Cart>(ErrorCode.SERVER, "unable to add item to cart at the moment, try again later");

    EmitToSingleUser(io, UserId, "cart-created", AddToCart);

    return ServiceResponse.success<Cart>("item added to cart successfully");
  }

  async IncrementCartItem(UserId: string, CartId: string): Promise<ServiceResult<Cart>> {

    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (!UserExists) return ServiceResponse.failure<Cart>(ErrorCode.NOTFOUND, "your details are not availabele, kindly register.");
    
    let CartExists = await this.prisma.cart.findUnique({
      where: {
        CartId,
        UserId: UserExists.UserId
      }
    });

    if (!CartExists) return ServiceResponse.failure<Cart>(ErrorCode.NOTFOUND, "cart item does not exist");

    let UpdateCart = await this.prisma.cart.update({
      where: {
        CartId
      },
      data: {
        Quantity: {
          increment: 1
        }
      }
    });

    if (!UpdateCart) return ServiceResponse.failure<Cart>(ErrorCode.SERVER, "unable to update cart item at the moment");

    EmitToSingleUser(io, UserId, "cart-updated", UpdateCart);

    return ServiceResponse.success<Cart>("cart item updated successfully");
  }
  async DecrementCartItem(UserId: string, CartId: string): Promise<ServiceResult<Cart>> {

    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (!UserExists) return ServiceResponse.failure<Cart>(ErrorCode.NOTFOUND, "your details are not availabele, kindly register.");
    
    let CartExists = await this.prisma.cart.findUnique({
      where: {
        CartId,
        UserId: UserExists.UserId
      }
    });

    if (!CartExists) return ServiceResponse.failure<Cart>(ErrorCode.NOTFOUND, "cart item does not exist");

    if (CartExists.Quantity <= 1) {
      return ServiceResponse.failure<Cart>(ErrorCode.VALIDATION, "cart item quantity cannot be less than 1, consider deleting the item instead");
    }

    let UpdateCart = await this.prisma.cart.update({
      where: {
        CartId
      },
      data: {
        Quantity: {
          decrement: 1
        }
      }
    });

    if (!UpdateCart) return ServiceResponse.failure<Cart>(ErrorCode.SERVER, "unable to update cart item at the moment");

    EmitToSingleUser(io, UserExists.UserId, "cart-updated", UpdateCart);
    
    return ServiceResponse.success<Cart>("cart item updated successfully");
  }
  async DeleteCart(UserId: string, CartId: string): Promise<ServiceResult<Cart>> {

    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (!UserExists) return ServiceResponse.failure<Cart>(ErrorCode.NOTFOUND, "your details are not availabele, kindly register.");
    
    let CartExists = await this.prisma.cart.findUnique({
      where: {
        CartId,
        UserId: UserExists.UserId
      }
    });

    if (!CartExists) return ServiceResponse.failure<Cart>(ErrorCode.NOTFOUND, "cart item does not exist");

    let DeleteCart = await this.prisma.cart.delete({
      where: {
        CartId
      }
    });

    if (!DeleteCart) return ServiceResponse.failure<Cart>(ErrorCode.SERVER, "unable to delete cart item at the moment");

    io.emit("cart-deleted", DeleteCart);

    return ServiceResponse.success<Cart>("cart item deleted successfully");
  }
  async GetUserCarts(UserId: string): Promise<ServiceResult<Cart>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (!UserExists) return ServiceResponse.failure<Cart>(ErrorCode.NOTFOUND, "your details are not availabele, kindly register.");

    let UserCarts = await this.prisma.cart.findMany({
      where: {
        UserId
      },
      orderBy: {
        AddedAt: 'desc'
      },
      include: {
        Delicacy: true
      }
    });

    if(!UserCarts) return ServiceResponse.failure<Cart>(ErrorCode.SERVER, "unable to fetch your cart items at the moment");

    return ServiceResponse.success<Cart>("user cart items fetched successfully", undefined, UserCarts);
  } 
}