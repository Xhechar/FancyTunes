import { PrismaClient } from "@prisma/client";
import { IAccommodationService } from "../interfaces/abstracts/services.abstracts";
import { CreateAccommodationDto, UpdateAccommodationDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { Accommodation } from "@prisma/client";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { v4 } from "uuid";

export class AccommodationsService implements IAccommodationService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateAccommodation(Accommodation: CreateAccommodationDto): Promise<ServiceResult<Accommodation>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId: Accommodation.UserId
      }
    });

    if (UserExists == null) return ServiceResponse.failure<Accommodation>(ErrorCode.NOTFOUND, "user details are unavailable at the moment.");

    let RoomExists = await this.prisma.room.findUnique({
      where: {
        RoomId: Accommodation.RoomId
      }
    });

    if (RoomExists == null) return ServiceResponse.failure<Accommodation>(ErrorCode.NOTFOUND, "room details are unavailable at the moment.");

    let CreateAccommodation = await this.prisma.accommodation.create({
      data: {
        AccommodationId: v4(),
        ...Accommodation,
        IsActive: true,
        TotalAmount: Number(RoomExists.PricePerNight) * (new Date(Accommodation.CheckOutDate).getTime() - new Date(Accommodation.CheckInDate).getTime()) / (1000 * 3600 * 24),
      }
    });

    if (!CreateAccommodation) return ServiceResponse.failure<Accommodation>(ErrorCode.SERVER, "unable to create accommodation");

    return ServiceResponse.success<Accommodation>("accommodation created successfully");
  }
  async UpdateAccommodation(AccommodationId: string, Accommodation: UpdateAccommodationDto): Promise<ServiceResult<Accommodation>> {
    throw new Error("Method not implemented.");
  }
  async DeleteAccommodation(AccommodationId: string): Promise<ServiceResult<Accommodation>> {
    throw new Error("Method not implemented.");
  }
  async GetAllAccommodations(): Promise<ServiceResult<Accommodation>> {
    throw new Error("Method not implemented.");
  }
  async GetUserAccommodations(UserId: string): Promise<ServiceResult<Accommodation>> {
    throw new Error("Method not implemented.");
  }

}