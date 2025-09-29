import axios from "axios";
import { BackendRoute } from "../shared/shared.data";
import { ServiceResult } from "../shared/service.result/service.result";
import { ChangePasswoerdDto, LoginDetails } from "../interfaces/interfaces";

export class AuthService {
  private static ApiUrl = `${BackendRoute}auth`;

  static async Login(LoginDetails: LoginDetails): Promise<ServiceResult<object>> {
    const result = await axios.post(`${this.ApiUrl}/login-user`, LoginDetails, {
      withCredentials: true,
    });
    return result.data as ServiceResult<object>;
  }

  static async VerifyMail(Email: string): Promise<ServiceResult<object>> {
    const result = await axios.post(
      `${this.ApiUrl}/verify-mail/${Email}`,
      {},
      { withCredentials: true }
    );
    return result.data as ServiceResult<object>;
  }

  static async ChangePassword(
    Passwords: ChangePasswoerdDto
  ): Promise<ServiceResult<object>> {
    const result = await axios.put(
      `${this.ApiUrl}/change-password`,
      Passwords,
      { withCredentials: true }
    );
    return result.data as ServiceResult<object>;
  }

  static async Logout(): Promise<ServiceResult<object>> {
    const result = await axios.post(
      `${this.ApiUrl}/logout`,
      {},
      { withCredentials: true }
    );
    return result.data as ServiceResult<object>;
  }
}