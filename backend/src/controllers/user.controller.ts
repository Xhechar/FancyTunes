import { Request, Response } from "express";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { UserService } from "../services/user.service";
import { ExtendedRequest, getUserIdFromToken } from "../middlewares/backend.middleware";

export class UserController {

  private userService: UserService = new UserService();

  async CreateUser(Req: Request, Res: Response) {
    try {

      let result = await this.userService.CreateUser(Req.body);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async UpdateUser(Req: Request, Res: Response) {
    try {

      let result = await this.userService.UpdateUser(getUserIdFromToken(Req as ExtendedRequest), Req.body);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async UpdateUserProfileImage(Req: Request, Res: Response) {
    try {

      let result = await this.userService.UpdateUserProfileImage(
        getUserIdFromToken(Req as ExtendedRequest),
        Req.params.ProfileImage as string,
      );

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async DeleteUser(Req: Request, Res: Response) {
    try {

      let result = await this.userService.DeleteUser(
        Req.params.UserId as string,
      );

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetUserByUserId(Req: Request, Res: Response) {
    try {

      let result = await this.userService.GetUserByUserId(getUserIdFromToken(Req as ExtendedRequest));

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetAllUsers(Req: Request, Res: Response) {
    try {

      let result = await this.userService.GetAllUsers();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  
}