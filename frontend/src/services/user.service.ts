import axios from "axios";
import { BackendRoute } from "../shared/shared.data";
import { ServiceResult } from "../shared/service.result/service.result";
import { User } from "../interfaces/interfaces";
import {
  CreateUserDto,
  UpdateUserDto,
} from "../interfaces/dtos/interfaces.dtos";

export class UsersService {
  private static ApiUrl = `${BackendRoute}user`;

  static async CreateUser(User: CreateUserDto): Promise<ServiceResult<User>> {
    const result = await axios.post(`${this.ApiUrl}/create-user`, User);
    return result.data as ServiceResult<User>;
  }

  static async UpdateUser(User: UpdateUserDto): Promise<ServiceResult<User>> {
    const result = await axios.put(`${this.ApiUrl}/update-user`, User, {
      withCredentials: true,
    });
    return result.data as ServiceResult<User>;
  }

  static async UpdateUserProfileImage(
    ProfileImage: string
  ): Promise<ServiceResult<User>> {
    const result = await axios.patch(
      `${this.ApiUrl}/update-user-profile-image/${ProfileImage}`,
      { withCredentials: true }
    );
    return result.data as ServiceResult<User>;
  }

  static async DeleteUser(UserId: string): Promise<ServiceResult<User>> {
    const result = await axios.delete(`${this.ApiUrl}/delete-user/${UserId}`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<User>;
  }

  static async GetUserByUserId(): Promise<ServiceResult<User>> {
    const result = await axios.get(`${this.ApiUrl}/get-user-by-user-id`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<User>;
  }

  static async GetAllUsers(): Promise<ServiceResult<User>> {
    const result = await axios.get(`${this.ApiUrl}/get-all-users`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<User>;
  }
}