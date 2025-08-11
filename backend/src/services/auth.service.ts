import { IAuthService } from "../interfaces/abstracts/services.abstracts";
import { LoginDetails, ChangePasswoerdDto } from "../interfaces/backend.interfaces";
import { ServiceResult } from "../interfaces/service.result/service.result";

export class AuthService implements IAuthService {
  loginUser(loginDetails: LoginDetails): ServiceResult<object> {
    throw new Error("Method not implemented.");
  }
  verufyMail(Email: string): ServiceResult<object> {
    throw new Error("Method not implemented.");
  }
  changePassword(details: ChangePasswoerdDto): ServiceResult<object> {
    throw new Error("Method not implemented.");
  }
  logput(): void {
    throw new Error("Method not implemented.");
  }
  
}