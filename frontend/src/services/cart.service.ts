import axios from "axios";
import { BackendRoute } from "../shared/shared.data";
import { ServiceResult } from "../shared/service.result/service.result";
import { Cart } from "../interfaces/interfaces";
import { CreateCartDto } from "../interfaces/dtos/interfaces.dtos";

export class CartService {
  private static ApiUrl = `${BackendRoute}cart`;

  static async CreateCart(DelicacyId: string, Cart: CreateCartDto): Promise<ServiceResult<Cart>> {
    const result = await axios.post(
      `${this.ApiUrl}/create-cart/${DelicacyId}`,
      {...Cart},
      { withCredentials: true }
    );
    return result.data as ServiceResult<Cart>;
  }

  static async IncrementCartItem(CartId: string): Promise<ServiceResult<Cart>> {
    const result = await axios.put(
      `${this.ApiUrl}/increment-cart-item/${CartId}`,
      {},
      { withCredentials: true }
    );
    return result.data as ServiceResult<Cart>;
  }

  static async DecrementCartItem(CartId: string): Promise<ServiceResult<Cart>> {
    const result = await axios.put(
      `${this.ApiUrl}/decrement-cart-item/${CartId}`,
      {},
      { withCredentials: true }
    );
    return result.data as ServiceResult<Cart>;
  }

  static async DeleteCart(CartId: string): Promise<ServiceResult<Cart>> {
    const result = await axios.delete(`${this.ApiUrl}/delete-cart/${CartId}`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Cart>;
  }

  static async GetUserCarts(): Promise<ServiceResult<Cart>> {
    const result = await axios.get(`${this.ApiUrl}/get-user-carts`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Cart>;
  }
}