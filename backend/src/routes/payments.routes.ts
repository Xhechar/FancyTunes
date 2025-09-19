import { Router } from "express";
import { verifyToken, verifyAdmin, verifyUser } from "../middlewares/backend.middleware";
import { PaymentController } from "../controllers/payments.controller";

export const PaymentRouter = Router();

const paymentController: PaymentController = new PaymentController();

PaymentRouter.post(
  "/create-payment/:CommodityId",
  verifyToken,
  verifyUser,
  async (Req, Res) => await paymentController.CreatePayment(Req, Res)
);

PaymentRouter.get(
  "/get-user-payments",
  verifyToken,
  verifyUser,
  async (Req, Res) => await paymentController.GetUserPayments(Req, Res)
);

PaymentRouter.get(
  "/get-all-payments",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await paymentController.GetAllPayments(Req, Res)
);

PaymentRouter.delete(
  "/delete-payment/:PaymentId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await paymentController.DeletePayment(Req, Res)
);

PaymentRouter.post(
  "/mpesa-callback",
  async (Req, Res) => await paymentController.MpesaCallback(Req, Res)
);
