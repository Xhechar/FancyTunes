import { Router } from "express";
import { verifyToken, verifyAdmin, verifyUser } from "../middlewares/backend.middleware";
import { OrderController } from "../controllers/orders.controller";

export const OrderRouter = Router();

const orderController: OrderController = new OrderController();

OrderRouter.put(
  "/update-order/:OrderId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await orderController.UpdateOrder(Req, Res)
);

OrderRouter.delete(
  "/delete-order/:OrderId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await orderController.DeleteOrder(Req, Res)
);

OrderRouter.get(
  "/get-user-orders",
  verifyToken,
  verifyUser,
  async (Req, Res) => await orderController.GetUserOrders(Req, Res)
);

OrderRouter.get(
  "/get-all-orders",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await orderController.GetAllOrders(Req, Res)
);

OrderRouter.get(
  "/get-paid-orders",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await orderController.GetPaidOrders(Req, Res)
);

OrderRouter.get(
  "/get-unpaid-orders",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await orderController.GetUnpaidOrders(Req, Res)
);

OrderRouter.get(
  "/get-delivered-orders",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await orderController.GetDeliveredOrders(Req, Res)
);

OrderRouter.get(
  "/get-undelivered-orders",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await orderController.GetUndeliveredOrders(Req, Res)
);
