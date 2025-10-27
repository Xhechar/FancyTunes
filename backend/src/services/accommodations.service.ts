import { PrismaClient } from "@prisma/client";
import { IAccommodationService } from "../interfaces/abstracts/services.abstracts";
import { CreateAccommodationDto, UpdateAccommodationDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { Accommodation } from "@prisma/client";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { v4 } from "uuid";
import { io } from "../server";
import { EmitToSingleUser } from "../sockets/socket.io";

export class AccommodationsService implements IAccommodationService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateAccommodation(UserId: string, RoomId: string, Accommodation: CreateAccommodationDto): Promise<ServiceResult<Accommodation>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (UserExists == null) return ServiceResponse.failure<Accommodation>(ErrorCode.NOTFOUND, "user details are unavailable at the moment.");

    let RoomExists = await this.prisma.room.findUnique({
      where: {
        RoomId
      }
    });

    if (RoomExists == null) return ServiceResponse.failure<Accommodation>(ErrorCode.NOTFOUND, "room details are unavailable at the moment.");

    let CreateAccommodation = await this.prisma.accommodation.create({
      data: {
        AccommodationId: v4(),
        UserId: UserExists.UserId,
        RoomId: RoomExists.RoomId,
        ...Accommodation,
        IsActive: true,
        TotalAmount: Number(RoomExists.PricePerNight) * (new Date(Accommodation.CheckOutDate).getTime() - new Date(Accommodation.CheckInDate).getTime()) / (1000 * 3600 * 24),
        PaymentStatus: "paid"
      },
      include: {
        Room: true
      }
    });

    if (!CreateAccommodation) return ServiceResponse.failure<Accommodation>(ErrorCode.SERVER, "unable to create accommodation");

    let UpdateRoom = await this.prisma.room.update({
      data: {
        RoomCount: {
          decrement: 1
        }
      },
      where: {
        RoomId: RoomExists.RoomId
      }
    });

    io.emit("room-updated", UpdateRoom);

    EmitToSingleUser(io, UserExists.UserId, "accommodation-created", CreateAccommodation);

    return ServiceResponse.success<Accommodation>("accommodation created successfully");
  }
  async UpdateAccommodation(UserId: string, AccommodationId: string, Accommodation: UpdateAccommodationDto): Promise<ServiceResult<Accommodation>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId: UserId
      }
    });

    if (UserExists == null) return ServiceResponse.failure<Accommodation>(ErrorCode.NOTFOUND, "your details are unavailable at the moment.");

    let AccommodationExists = await this.prisma.accommodation.findFirst({
      where: {
        AccommodationId: AccommodationId,
        UserId: UserExists.UserId
      }
    });

    if (AccommodationExists == null) return ServiceResponse.failure<Accommodation>(ErrorCode.NOTFOUND, "accommodation details are unavailable at the moment.");

    let UpdateAccommodation = await this.prisma.accommodation.update({
      where: {
        AccommodationId: AccommodationExists.AccommodationId
      },
      data: {
        ...Accommodation
      },
      include: {
        Room: true
      }
    });

    if (!UpdateAccommodation) return ServiceResponse.failure<Accommodation>(ErrorCode.SERVER, "unable to update accommodation");

    EmitToSingleUser(io, UserExists.UserId, "accommodation-updated", UpdateAccommodation);

    return ServiceResponse.success<Accommodation>("accommodation updated successfully");
  }
  async DeleteAccommodation(AccommodationId: string): Promise<ServiceResult<Accommodation>> {
    
    let AccommodationExists = await this.prisma.accommodation.findUnique({
      where: {
        AccommodationId: AccommodationId
      }
    });

    if (AccommodationExists == null) return ServiceResponse.failure<Accommodation>(ErrorCode.NOTFOUND, "accommodation details are unavailable at the moment.");

    let DeleteAccommodation = await this.prisma.accommodation.delete({
      where: {
        AccommodationId: AccommodationExists.AccommodationId
      },
      include: {
        Room: true
      }
    });

    if (!DeleteAccommodation) return ServiceResponse.failure<Accommodation>(ErrorCode.SERVER, "unable to delete accommodation");

    EmitToSingleUser(io, AccommodationExists.UserId, "accommodation-deleted", DeleteAccommodation);

    return ServiceResponse.success<Accommodation>("accommodation deleted successfully");
  }
  async GetAllAccommodations(): Promise<ServiceResult<Accommodation>> {
    
    let Accommodations = await this.prisma.accommodation.findMany({
      include: {
        User: true,
        Room: true
      }
    });

    if (Accommodations.length == 0) return ServiceResponse.failure<Accommodation>(ErrorCode.NOTFOUND, "no accommodations found.");

    return ServiceResponse.success<Accommodation>("accommodations fetched successfully", undefined, Accommodations);
  }
  async GetUserAccommodations(UserId: string): Promise<ServiceResult<Accommodation>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId: UserId
      }
    });

    if (UserExists == null) return ServiceResponse.failure<Accommodation>(ErrorCode.NOTFOUND, "user details are unavailable at the moment.");

    let Accommodations = await this.prisma.accommodation.findMany({
      where: {
        UserId: UserExists.UserId
      },
      include: {
        User: true,
        Room: true
      }
    });

    if (Accommodations.length == 0) return ServiceResponse.failure<Accommodation>(ErrorCode.NOTFOUND, "no accommodations found.");

    return ServiceResponse.success<Accommodation>("accommodations fetched successfully", undefined, Accommodations);
  }

}