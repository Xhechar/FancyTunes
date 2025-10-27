
import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { verifyToken, verifyUser } from "../middlewares/backend.middleware";

export const CartRouter = Router();

const cartController: CartController = new CartController();

CartRouter.post(
  "/create-cart/:DelicacyId",
  verifyToken,
  verifyUser,
  async (Req, Res) => await cartController.CreateCart(Req, Res)
);

CartRouter.patch(
  "/increment-cart-item/:CartId",
  verifyToken,
  verifyUser,
  async (Req, Res) => await cartController.IncrementCartItem(Req, Res)
);

CartRouter.patch(
  "/decrement-cart-item/:CartId",
  verifyToken,
  verifyUser,
  async (Req, Res) => await cartController.DecrementCartItem(Req, Res)
);

CartRouter.delete(
  "/delete-cart/:CartId",
  verifyToken,
  verifyUser,
  async (Req, Res) => await cartController.DeleteCart(Req, Res)
);

CartRouter.get(
  "/get-user-carts",
  verifyToken,
  verifyUser,
  async (Req, Res) => await cartController.GetUserCarts(Req, Res)
);

CartRouter.delete(
  "/clear-user-carts",
  verifyToken,
  verifyUser,
  async (Req, Res) => await cartController.ClearCart(Req, Res)
);