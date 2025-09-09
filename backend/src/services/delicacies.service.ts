import { IDelicacyService } from "../interfaces/abstracts/services.abstracts";
import { Delicacy, PrismaClient } from "@prisma/client";
import { CreateDelicacyDto, UpdateDelicacyDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { v4 } from "uuid";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { io } from "../server";
import { CreateDelicacySchema, UpdateDelicacySchema } from "../validators/payload.validators";

export class DelicaciesService implements IDelicacyService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateDelicacy(Delicacy: CreateDelicacyDto): Promise<ServiceResult<Delicacy>> {
    
    let { error } = CreateDelicacySchema.validate(Delicacy);

    if (error) return ServiceResponse.failure<Delicacy>(ErrorCode.VALIDATION, error.details[0].message);

    let CreateDelicacy = await this.prisma.delicacy.create({
      data: {
        DelicacyId: v4(),
        ...Delicacy
      }
    });

    if (!CreateDelicacy) return ServiceResponse.failure<Delicacy>(ErrorCode.SERVER, "unable to create delicacy at the moment");

    io.emit("delicacy-created", CreateDelicacy);

    return ServiceResponse.success<Delicacy>("delicacy created successfully");
  }
  async UpdateDelicacy(DelicacyId: string, Delicacy: UpdateDelicacyDto): Promise<ServiceResult<Delicacy>> {

    let { error } = UpdateDelicacySchema.validate(Delicacy);

    if (error) return ServiceResponse.failure<Delicacy>(ErrorCode.VALIDATION, error.details[0].message);
    
    let DelicacyExists = await this.prisma.delicacy.findUnique({
      where: {
        DelicacyId
      }
    });

    if (!DelicacyExists) return ServiceResponse.failure<Delicacy>(ErrorCode.NOTFOUND, "the specified delicacy does not exist");

    let UpdateDelicacy = await this.prisma.delicacy.update({
      where: {
        DelicacyId
      },
      data: {
        ...Delicacy
      }
    });

    if (!UpdateDelicacy) return ServiceResponse.failure<Delicacy>(ErrorCode.SERVER, "unable to update delicacy at the moment");

    io.emit("delicacy-updated", UpdateDelicacy);

    return ServiceResponse.success<Delicacy>("delicacy updated successfully");
  }
  async DeleteDelicacy(DelicacyId: string): Promise<ServiceResult<Delicacy>> {
    
    let DelicacyExists = await this.prisma.delicacy.findUnique({
      where: {
        DelicacyId
      }
    });

    if (!DelicacyExists) return ServiceResponse.failure<Delicacy>(ErrorCode.NOTFOUND, "the specified delicacy does not exist");

    let DeleteDelicacy = await this.prisma.delicacy.delete({
      where: {
        DelicacyId
      }
    });

    if (!DeleteDelicacy) return ServiceResponse.failure<Delicacy>(ErrorCode.SERVER, "unable to delete delicacy at the moment");

    io.emit("delicacy-deleted", DeleteDelicacy);

    return ServiceResponse.success<Delicacy>("delicacy deleted successfully");
  }
  async GetDelicacyByDelicacyId(DelicacyId: string): Promise<ServiceResult<Delicacy>> {
    
    let DelicacyExists = await this.prisma.delicacy.findUnique({
      where: {
        DelicacyId
      },
      include: {
        Reviews: true
      }
    });

    if (!DelicacyExists) return ServiceResponse.failure<Delicacy>(ErrorCode.NOTFOUND, "the specified delicacy does not exist");

    return ServiceResponse.success<Delicacy>("delicacy fetched successfully", DelicacyExists);
  }
  async GetAllDelicacies(): Promise<ServiceResult<Delicacy>> {
    
    let AllDelicacies = await this.prisma.delicacy.findMany({
      orderBy: {
        CreatedAt: 'desc'
      },
      include: {
        Reviews: true,
        OrderItems: true,
        Orders: true
      }
    });

    if (!AllDelicacies) return ServiceResponse.failure<Delicacy>(ErrorCode.SERVER, "unable to fetch delicacies at the moment");

    return ServiceResponse.success<Delicacy>("all delicacies fetched successfully", undefined, AllDelicacies);
  }

  async GetAvailableDelicacies(): Promise<ServiceResult<Delicacy>> {
    
    let AvailableDelicacies = await this.prisma.delicacy.findMany({
      where: {
        IsAvailable: true
      },
      orderBy: {
        CreatedAt: 'desc'
      },
      include: {
        Reviews: true,
        OrderItems: true,
        Orders: true
      }
    });

    if (!AvailableDelicacies) return ServiceResponse.failure<Delicacy>(ErrorCode.SERVER, "unable to fetch available delicacies at the moment");

    return ServiceResponse.success<Delicacy>("available delicacies fetched successfully", undefined, AvailableDelicacies);
  }

  async GetDelicaciesByCategory(Category: string): Promise<ServiceResult<Delicacy>> {
    
    let DelicaciesByCategory = await this.prisma.delicacy.findMany({
      where: {
        Category: {
          equals: Category
        }
      },
      orderBy: {
        CreatedAt: 'desc'
      },
      include: {
        Reviews: true,
        OrderItems: true,
        Orders: true
      }
    });

    if (!DelicaciesByCategory) return ServiceResponse.failure<Delicacy>(ErrorCode.SERVER, "unable to fetch delicacies by category at the moment");

    return ServiceResponse.success<Delicacy>("delicacies by category fetched successfully", undefined, DelicaciesByCategory);

  }
}