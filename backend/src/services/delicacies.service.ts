import { IDelicacyService } from "../interfaces/abstracts/services.abstracts";
import { Delicacy, PrismaClient } from "@prisma/client";
import { CreateDelicacyDto, UpdateDelicacyDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";

export class DelicaciesService implements IDelicacyService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateDelicacy(Delicacy: CreateDelicacyDto): Promise<ServiceResult<Delicacy>> {
    throw new Error("Method not implemented.");
  }
  async UpdateDelicacy(DelicacyId: string, Delicacy: UpdateDelicacyDto): Promise<ServiceResult<Delicacy>> {
    throw new Error("Method not implemented.");
  }
  async DeleteDelicacy(DelicacyId: string): Promise<ServiceResult<Delicacy>> {
    throw new Error("Method not implemented.");
  }
  async GetDelicacyByDelicacyId(DelicacyId: string): Promise<ServiceResult<Delicacy>> {
    throw new Error("Method not implemented.");
  }
  async GetAllDelicacies(): Promise<ServiceResult<Delicacy>> {
    throw new Error("Method not implemented.");
  }  
}