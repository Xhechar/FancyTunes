import { Request, Response } from "express";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { BusinessRoomService } from "../services/business.room.service";

export class BussinessRoomController {

  private businessRoomService: BusinessRoomService = new BusinessRoomService();

  async CreateBusinessRoom(Req: Request, Res: Response) {
    try {

      let result = await this.businessRoomService.CreateBusinessRoom(Req.body);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async UpdateBusinessRoom(Req: Request, Res: Response) {
    try {

      let result = await this.businessRoomService.UpdateBusinessRoom(
        Req.params.BusinessRoomId as string,
        Req.body,
      );

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async DeleteBusinessRoom(Req: Request, Res: Response) {
    try {

      let result = await this.businessRoomService.DeleteBusinessRoom(
        Req.params.BusinessRoomId as string,
      );

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetBusinessRoomById(Req: Request, Res: Response) {
    try {

      let result = await this.businessRoomService.GetBusinessRoomById(
        Req.params.BusinessRoomId as string,
      );

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetAllBusinessRooms(Req: Request, Res: Response) {
    try {

      let result = await this.businessRoomService.GetAllBusinessRooms();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetAvailableBusinessRooms(Req: Request, Res: Response) {
    try {

      let result = await this.businessRoomService.GetAvailableBusinessRooms();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  
}