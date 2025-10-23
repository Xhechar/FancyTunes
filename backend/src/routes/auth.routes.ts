import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/backend.middleware";

export const AuthRouter = Router();

const authController: AuthController = new AuthController();

AuthRouter.post("/login-user", async (Req, Res) =>
  authController.loginUser(Req, Res)
);
AuthRouter.post("/verify-mail/:Email", async (Req, Res) =>
  authController.verifyMail(Req, Res)
);
AuthRouter.post("/verify-code/:Email", async (Req, Res) =>
  authController.verifyCode(Req, Res)
);
AuthRouter.put("/change-password", async (Req, Res) =>
  authController.changePassword(Req, Res)
);
AuthRouter.post("/logout", async (Req, Res) => authController.logput(Req, Res));
AuthRouter.post("/authenticate-user", verifyToken, verifyUser, async (Req, Res) =>
  authController.AuthenticateUser(Req, Res)
);
AuthRouter.post("/authenticate-admin", verifyToken, verifyAdmin, async (Req, Res) =>
  authController.AuthenticateAdmin(Req, Res)
);
