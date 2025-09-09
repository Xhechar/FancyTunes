import { BusinessRoom, PrismaClient } from "@prisma/client";
import { IBusinessRoomService } from "../interfaces/abstracts/services.abstracts";
import { CreateBusinessRoomDto, UpdateBusinessRoomDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { v4 } from "uuid";
import { createBusinessRoomSchema, updateBusinessRoomSchema } from "../validators/payload.validators";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { io } from "../server";

export class BusinessRoomService implements IBusinessRoomService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateBusinessRoom(Room: CreateBusinessRoomDto): Promise<ServiceResult<BusinessRoom>> {

    let { error } = createBusinessRoomSchema.validate(Room);

    if (error) return ServiceResponse.failure<BusinessRoom>(ErrorCode.VALIDATION, error.details[0].message);
    
    let CreateBussinessRoom = await this.prisma.businessRoom.create({
      data: {
        BusinessRoomId: v4(),
        ...Room
      }
    });

    if (!CreateBussinessRoom) return ServiceResponse.failure<BusinessRoom>(ErrorCode.SERVER, "unable to create business room at the moment");

    io.emit("business-room-created", CreateBussinessRoom);

    return ServiceResponse.success<BusinessRoom>("business room created successfully");
  }
  async UpdateBusinessRoom(BusinessRoomId: string, Room: UpdateBusinessRoomDto): Promise<ServiceResult<BusinessRoom>> {

    let { error } = updateBusinessRoomSchema.validate(Room);

    if (error) return ServiceResponse.failure<BusinessRoom>(ErrorCode.VALIDATION, error.details[0].message);
    
    let BusinessRoomExists = await this.prisma.businessRoom.findUnique({
      where: {
        BusinessRoomId
      }
    });

    if (!BusinessRoomExists) return ServiceResponse.failure<BusinessRoom>(ErrorCode.NOTFOUND, "business room does not exist");

    let UpdateBusinessRoom = await this.prisma.businessRoom.update({
      where: {
        BusinessRoomId
      },
      data: {
        ...Room
      }
    });

    if (!UpdateBusinessRoom) return ServiceResponse.failure<BusinessRoom>(ErrorCode.SERVER, "unable to update business room at the moment");

    io.emit("business-room-updated", UpdateBusinessRoom);

    return ServiceResponse.success<BusinessRoom>("business room updated successfully");
  }
  async DeleteBusinessRoom(BusinessRoomId: string): Promise<ServiceResult<BusinessRoom>> {
    
    let BusinessRoomExists = await this.prisma.businessRoom.findUnique({
      where: {
        BusinessRoomId
      }
    });

    if (!BusinessRoomExists) return ServiceResponse.failure<BusinessRoom>(ErrorCode.NOTFOUND, "business room does not exist");

    let DeleteBusinessRoom = await this.prisma.businessRoom.delete({
      where: {
        BusinessRoomId
      }
    });

    if (!DeleteBusinessRoom) return ServiceResponse.failure<BusinessRoom>(ErrorCode.SERVER, "unable to delete business room at the moment");

    io.emit("business-room-deleted", DeleteBusinessRoom);

    return ServiceResponse.success<BusinessRoom>("business room deleted successfully");
  }
  async GetBusinessRoomById(BusinessRoomId: string): Promise<ServiceResult<BusinessRoom>> {
    
    let BusinessRoomExists = await this.prisma.businessRoom.findUnique({
      where: {
        BusinessRoomId
      },
      include: {
        Bookings: true,
        Reviews: true
      }
    });

    if (!BusinessRoomExists) return ServiceResponse.failure<BusinessRoom>(ErrorCode.NOTFOUND, "business room does not exist");

    return ServiceResponse.success<BusinessRoom>("business room fetched successfully", BusinessRoomExists);
  }
  async GetAllBusinessRooms(): Promise<ServiceResult<BusinessRoom>> {
    
    let AllBusinessRooms = await this.prisma.businessRoom.findMany({
      include: {
        Bookings: true,
        Reviews: true
      },
      orderBy: {
        CreatedAt: "desc"
      }
    });

    if (!AllBusinessRooms || AllBusinessRooms.length == 0) return ServiceResponse.failure<BusinessRoom>(ErrorCode.NOTFOUND, "no business rooms found");

    return ServiceResponse.success<BusinessRoom>("business rooms fetched successfully", undefined, AllBusinessRooms);
  }
  async GetAvailableBusinessRooms(): Promise<ServiceResult<BusinessRoom>> {
    
    let AvailableBusinessRooms = await this.prisma.businessRoom.findMany({
      where: {
        RoomCount: { gt: 0 }
      },
      include: {
        Bookings: true,
        Reviews: true
      },
      orderBy: {
        CreatedAt: "desc"
      }
    });

    if (!AvailableBusinessRooms || AvailableBusinessRooms.length == 0) return ServiceResponse.failure<BusinessRoom>(ErrorCode.NOTFOUND, "no available business rooms found");

    return ServiceResponse.success<BusinessRoom>("available business rooms fetched successfully", undefined, AvailableBusinessRooms);
  }
  
}