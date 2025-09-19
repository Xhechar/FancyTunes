import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { verifyToken, verifyAdmin, verifyUser } from "../middlewares/backend.middleware";

export const UserRouter = Router();

const userController: UserController = new UserController();

UserRouter.post(
  "/create-user",
  async (Req, Res) => await userController.CreateUser(Req, Res)
);

UserRouter.put(
  "/update-user",
  verifyToken,
  verifyUser,
  async (Req, Res) => await userController.UpdateUser(Req, Res)
);

UserRouter.patch(
  "/update-user-profile-image",
  verifyToken,
  verifyUser,
  async (Req, Res) => await userController.UpdateUserProfileImage(Req, Res)
);

UserRouter.delete(
  "/delete-user/:UserId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await userController.DeleteUser(Req, Res)
);

UserRouter.get(
  "/get-user-by-user-id",
  verifyToken,
  verifyUser,
  async (Req, Res) => await userController.GetUserByUserId(Req, Res)
);

UserRouter.get(
  "/get-all-users",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await userController.GetAllUsers(Req, Res)
);
