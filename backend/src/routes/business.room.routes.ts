import { Router } from "express";
import { BussinessRoomController } from "../controllers/business.room.controller";
import { verifyAdmin, verifyToken } from "../middlewares/backend.middleware";

export const BusinessRoomRouter = Router();

const businessRoomController: BussinessRoomController =
  new BussinessRoomController();

BusinessRoomRouter.post(
  "/create-business-room",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await businessRoomController.CreateBusinessRoom(Req, Res)
);
BusinessRoomRouter.put(
  "/update-business-room/:BusinessRoomId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await businessRoomController.UpdateBusinessRoom(Req, Res)
);
BusinessRoomRouter.delete(
  "/delete-business-room/:BusinessRoomId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await businessRoomController.DeleteBusinessRoom(Req, Res)
);

BusinessRoomRouter.get(
  "/get-business-room/:BusinessRoomId",
  async (Req, Res) => await businessRoomController.GetBusinessRoomById(Req, Res)
);

BusinessRoomRouter.get(
  "/get-all-business-rooms",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await businessRoomController.GetAllBusinessRooms(Req, Res)
);

BusinessRoomRouter.get(
  "/get-available-business-rooms",
  async (Req, Res) =>
    await businessRoomController.GetAvailableBusinessRooms(Req, Res)
);