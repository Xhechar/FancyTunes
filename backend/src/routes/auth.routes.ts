import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export const AuthRouter = Router();

const authController: AuthController = new AuthController();

AuthRouter.post("/login-user", async (Req, Res) =>
  authController.loginUser(Req, Res)
);
AuthRouter.post("/verify-mail:/Email", async (Req, Res) =>
  authController.verifyMail(Req, Res)
);
AuthRouter.put("/change-password", async (Req, Res) =>
  authController.changePassword(Req, Res)
);
AuthRouter.post("/logout", async (Req, Res) => authController.logput(Req, Res));
