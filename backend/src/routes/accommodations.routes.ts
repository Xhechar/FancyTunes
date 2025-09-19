import { Router } from "express";
import { verifyToken, verifyAdmin, verifyUser } from "../middlewares/backend.middleware";
import { AccommodationController } from "../controllers/accommodations.controller";

export const AccommodationRouter = Router();

const accommodationController: AccommodationController =
  new AccommodationController();

AccommodationRouter.put(
  "/update-accommodation/:AccommodationId",
  verifyToken,
  verifyUser,
  async (Req, Res) =>
    await accommodationController.UpdateAccommodation(Req, Res)
);

AccommodationRouter.delete(
  "/delete-accommodation/:AccommodationId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) =>
    await accommodationController.DeleteAccommodation(Req, Res)
);

AccommodationRouter.get(
  "/get-all-accommodations",
  verifyToken,
  verifyAdmin,
  async (Req, Res) =>
    await accommodationController.GetAllAccommodations(Req, Res)
);

AccommodationRouter.get(
  "/get-user-accommodations",
  verifyToken,
  verifyUser,
  async (Req, Res) =>
    await accommodationController.GetUserAccommodations(Req, Res)
);
