import { Request, Response } from "express";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { RoomService } from "../services/room.service";

export class RoomController {

  private roomService: RoomService = new RoomService();

  async CreateRoom(Req: Request, Res: Response) {
    try {

      let result = await this.roomService.CreateRoom(Req.body);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async UpdateRoom(Req: Request, Res: Response) {
    try {

      let result = await this.roomService.UpdateRoom(Req.params.RoomId, Req.body);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async DeleteRoom(Req: Request, Res: Response) {
    try {

      let result = await this.roomService.DeleteRoom(Req.params.RoomId);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetRoomByRoomId(Req: Request, Res: Response) {
    try {

      let result = await this.roomService.GetRoomByRoomId(Req.params.RoomId);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetAllRooms(Req: Request, Res: Response) {
    try {

      let result = await this.roomService.GetAllRooms();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  
}