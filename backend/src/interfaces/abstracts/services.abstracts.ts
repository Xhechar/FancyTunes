import { ChangePasswoerdDto, LoginDetails } from "../backend.interfaces";
import { ServiceResult } from "../service.result/service.result";

export interface IAuthService {
  loginUser(loginDetails: LoginDetails): ServiceResult<object>;
  verufyMail(Email: string): ServiceResult<object>;
  changePassword(details: ChangePasswoerdDto): ServiceResult<object>;
  logput(): void;
}

export interface IUserService {
}