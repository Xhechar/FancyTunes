import { IRoomService } from "../interfaces/abstracts/services.abstracts";
import { PrismaClient, Room } from "@prisma/client";
import { CreateRoomDto, UpdateRoomDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { CreateRoomSchema, UpdateRoomSchema } from "../validators/payload.validators";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { v4 } from "uuid";
import { io } from "../server";

export class RoomService implements IRoomService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateRoom(Room: CreateRoomDto): Promise<ServiceResult<Room>> {
    
    let { error } = CreateRoomSchema.validate(Room);

    if (error) return ServiceResponse.failure<Room>(ErrorCode.VALIDATION, error.details[0].message);

    let CreateRoom = await this.prisma.room.create({
      data: {
        RoomId: v4(),
        ...Room
      }
    });

    if (!CreateRoom) return ServiceResponse.failure<Room>(ErrorCode.SERVER, "unable to create room at the moment");

    io.emit("room-created", CreateRoom);

    return ServiceResponse.success<Room>("room created successfully");
  }
  async UpdateRoom(RoomId: string, Room: UpdateRoomDto): Promise<ServiceResult<Room>> {
    
    let { error } = UpdateRoomSchema.validate(Room);

    if (error) return ServiceResponse.failure<Room>(ErrorCode.VALIDATION, error.details[0].message);
    
    let RoomExists = await this.prisma.room.findUnique({
      where: {
        RoomId
      }
    });

    if (!RoomExists) return ServiceResponse.failure<Room>(ErrorCode.NOTFOUND, "the specified room does not exist");

    let UpdateRoom = await this.prisma.room.update({
      where: {
        RoomId
      },
      data: {
        ...Room
      }
    });

    if (!UpdateRoom) return ServiceResponse.failure<Room>(ErrorCode.SERVER, "unable to update room at the moment");

    io.emit("room-updated", UpdateRoom);

    return ServiceResponse.success<Room>("room updated successfully");
  }
  async DeleteRoom(RoomId: string): Promise<ServiceResult<Room>> {
    
    let RoomExists = await this.prisma.room.findUnique({
      where: {
        RoomId
      }
    });

    if (!RoomExists) return ServiceResponse.failure<Room>(ErrorCode.NOTFOUND, "room specified is not available at the monent");

    let DeleteRoom = await this.prisma.room.delete({
      where: {
        RoomId
      }
    });

    if (!DeleteRoom) return ServiceResponse.failure<Room>(ErrorCode.SERVER, "unable to delete room at the moment");

    io.emit("room-deleted", DeleteRoom);

    return ServiceResponse.success("room successfully deleted.")
  }
  async GetRoomByRoomId(RoomId: string): Promise<ServiceResult<Room>> {
    
    let RoomExists = await this.prisma.room.findUnique({
      where: {
        RoomId
      },
      include: {
        Reviews: true
      }
    });

    if (!RoomExists) return ServiceResponse.failure<Room>(ErrorCode.NOTFOUND, "the specified room does not exist");

    return ServiceResponse.success<Room>("room fetched successfully", RoomExists);
  }
  async GetAllRooms(): Promise<ServiceResult<Room>> {
    
    let AllRooms = await this.prisma.room.findMany({
      include: {
        Reviews: true,
        RoomImages: true,
        Accommodations: true
      },
      orderBy: {
        CreatedAt: 'desc'
      }
    });

    if(!AllRooms) return ServiceResponse.failure<Room>(ErrorCode.NOTFOUND, "rooms specified are not available at the moment");

    return ServiceResponse.success<Room>("all rooms fetched successfully", undefined, AllRooms);
  }
}