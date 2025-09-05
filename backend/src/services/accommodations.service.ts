import { PrismaClient } from "@prisma/client";
import { IAccommodationService } from "../interfaces/abstracts/services.abstracts";
import { CreateAccommodationDto, UpdateAccommodationDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { Accommodation } from "@prisma/client";

export class AccommodationsService implements IAccommodationService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateAccommodation(Accommodation: CreateAccommodationDto): Promise<ServiceResult<Accommodation>> {
    throw new Error("Method not implemented.");
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