import { IRoomService } from "../interfaces/abstracts/services.abstracts";
import { PrismaClient, Room } from "@prisma/client";
import { CreateRoomDto, UpdateRoomDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";

export class RoomService implements IRoomService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateRoom(Room: CreateRoomDto): Promise<ServiceResult<Room>> {
    throw new Error("Method not implemented.");
  }
  async UpdateRoom(RoomId: string, Room: UpdateRoomDto): Promise<ServiceResult<Room>> {
    throw new Error("Method not implemented.");
  }
  async DeleteRoom(RoomId: string): Promise<ServiceResult<Room>> {
    throw new Error("Method not implemented.");
  }
  async GetRoomByRoomId(RoomId: string): Promise<ServiceResult<Room>> {
    throw new Error("Method not implemented.");
  }
  async GetAllRooms(): Promise<ServiceResult<Room>> {
    throw new Error("Method not implemented.");
  }
}