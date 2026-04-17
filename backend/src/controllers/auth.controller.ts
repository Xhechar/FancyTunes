import { Request, Response } from "express";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { AuthService } from "../services/auth.service";
import { getUserIdFromToken } from "../middlewares/backend.middleware";

export class AuthController {
  private userService: AuthService = new AuthService();

  async loginUser(Req: Request, Res: Response) {
    try {
      let result = await this.userService.loginUser(Req.body);

      if (result.success) {
        Res.cookie("auth_token", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          maxAge: 45 * 60 * 1000,
          signed: true,
        });

        let { token, ...rest } = result;

        return Res.status(200).json(rest);
      }

      return Res.status(200).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.failure<object>(
          ErrorCode.SERVER,
          error instanceof Error
            ? error.message
            : "an internal server error occured."
        )
      );
    }
  }
  async verifyMail(Req: Request, Res: Response) {
    try {
      let result = await this.userService.verifyMail(Req.params.Email);

      return Res.status(200).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.failure<object>(
          ErrorCode.SERVER,
          error instanceof Error
            ? error.message
            : "an internal server error occured."
        )
      );
    }
  }
  async verifyCode(Req: Request, Res: Response) {
    try {
      let result = await this.userService.verifyCode(Req.params.Email, Req.body.VerificationCode);

      return Res.status(200).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.failure<object>(
          ErrorCode.SERVER,
          error instanceof Error
            ? error.message
            : "an internal server error occured."
        )
      );
    }
  }
  async changePassword(Req: Request, Res: Response) {
    try {
      let result = await this.userService.changePassword(Req.body);

      return Res.status(200).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.failure<object>(
          ErrorCode.SERVER,
          error instanceof Error
            ? error.message
            : "an internal server error occured."
        )
      );
    }
  }
  async logput(Req: Request, Res: Response) {
    try {
      Res.clearCookie("auth_token", { signed: true, httpOnly: true });

      return Res.status(200).json(
        ServiceResponse.success<object>("logged out successfully")
      );
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.failure<object>(
          ErrorCode.SERVER,
          error instanceof Error
            ? error.message
            : "an internal server error occured."
        )
      );
    }
  }

  async AuthenticateUser(Req: Request, Res: Response) {
    if (getUserIdFromToken(Req)) {
      return Res.status(200).json(
        ServiceResponse.success<object>("user authenticated successfully", undefined, undefined, "user")
      );
    } else {
      return Res.status(200).json(
        ServiceResponse.failure<object>(
          ErrorCode.UNAUTHORIZED,
          "user not authenticated"
        )
      );
    }
  }

  async AuthenticateAdmin(Req: Request, Res: Response) {
    if (getUserIdFromToken(Req)) {
      return Res.status(200).json(
        ServiceResponse.success<object>("admin authenticated successfully", undefined, undefined, "admin")
      );
    } else {
      return Res.status(200).json(
        ServiceResponse.failure<object>(
          ErrorCode.UNAUTHORIZED,
          "admin not authenticated"
        )
      );
    }
  }
}