import { PrismaClient } from "@prisma/client";
import { IAuthService } from "../interfaces/abstracts/services.abstracts";
import { LoginDetails, ChangePasswoerdDto } from "../interfaces/backend.interfaces";
import { ServiceResult } from "../interfaces/service.result/service.result";

export class AuthService implements IAuthService {
  private prisma = new PrismaClient({
    log: ["error"],
  });

  async loginUser(loginDetails: LoginDetails): Promise<ServiceResult<object>> {
    throw new Error("Method not implemented.");
  }
  async verifyMail(Email: string): Promise<ServiceResult<object>> {
    throw new Error("Method not implemented.");
  }
  async changePassword(details: ChangePasswoerdDto): Promise<ServiceResult<object>> {
    throw new Error("Method not implemented.");
  }
  logput(): void {
    throw new Error("Method not implemented.");
  }
}