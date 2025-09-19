import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/backend.middleware";
import { DelicacyController } from "../controllers/delicacies.controller";

export const DelicacyRouter = Router();

const delicacyController: DelicacyController = new DelicacyController();

DelicacyRouter.post(
  "/create-delicacy",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await delicacyController.CreateDelicacy(Req, Res)
);

DelicacyRouter.put(
  "/update-delicacy/:DelicacyId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await delicacyController.UpdateDelicacy(Req, Res)
);

DelicacyRouter.delete(
  "/delete-delicacy/:DelicacyId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await delicacyController.DeleteDelicacy(Req, Res)
);

DelicacyRouter.get(
  "/get-delicacy/:DelicacyId",
  async (Req, Res) => await delicacyController.GetDelicacyByDelicacyId(Req, Res)
);

DelicacyRouter.get(
  "/get-all-delicacies",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await delicacyController.GetAllDelicacies(Req, Res)
);

DelicacyRouter.get(
  "/get-available-delicacies",
  async (Req, Res) => await delicacyController.GetAvailableDelicacies(Req, Res)
);

DelicacyRouter.post(
  "/get-delicacies-by-category",
  async (Req, Res) => await delicacyController.GetDelicaciesByCategory(Req, Res)
);
