import { Router } from "express";
import { RoomController } from "../controllers/room.controller";
import { verifyToken, verifyAdmin } from "../middlewares/backend.middleware";

export const RoomRouter = Router();

const roomController: RoomController = new RoomController();

RoomRouter.post(
  "/create-room",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await roomController.CreateRoom(Req, Res)
);

RoomRouter.put(
  "/update-room/:RoomId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await roomController.UpdateRoom(Req, Res)
);

RoomRouter.delete(
  "/delete-room/:RoomId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await roomController.DeleteRoom(Req, Res)
);

RoomRouter.get(
  "/get-room/:RoomId",
  async (Req, Res) => await roomController.GetRoomByRoomId(Req, Res)
);

RoomRouter.get(
  "/get-all-rooms",
  async (Req, Res) => await roomController.GetAllRooms(Req, Res)
);
