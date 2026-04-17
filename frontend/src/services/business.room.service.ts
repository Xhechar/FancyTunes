import axios from "axios";
import { BackendRoute } from "../shared/shared.data";
import { ServiceResult } from "../shared/service.result/service.result";
import { BusinessRoom } from "../interfaces/interfaces";
import {
  CreateBusinessRoomDto,
  UpdateBusinessRoomDto,
} from "../interfaces/dtos/interfaces.dtos";

export class BusinessRoomService {
  private static readonly ApiUrl = `${BackendRoute}business-room`;

  public static async CreateBusinessRoom(
    BusinessRoom: CreateBusinessRoomDto
  ): Promise<ServiceResult<BusinessRoom>> {
    let result = await axios.post<ServiceResult<BusinessRoom>>(
      `${this.ApiUrl}/create-business-room`,
      BusinessRoom,
      { withCredentials: true }
    );
    return result.data;
  }

  public static async UpdateBusinessRoom(
    BusinessRoomId: string,
    BusinessRoom: UpdateBusinessRoomDto
  ): Promise<ServiceResult<BusinessRoom>> {
    let result = await axios.put<ServiceResult<BusinessRoom>>(
      `${this.ApiUrl}/update-business-room/${BusinessRoomId}`,
      BusinessRoom,
      { withCredentials: true }
    );
    return result.data;
  }

  public static async DeleteBusinessRoom(
    BusinessRoomId: string
  ): Promise<ServiceResult<boolean>> {
    let result = await axios.delete<ServiceResult<boolean>>(
      `${this.ApiUrl}/delete-business-room/${BusinessRoomId}`,
      { withCredentials: true }
    );
    return result.data;
  }

  public static async GetBusinessRoomByBusinessRoomId(
    BusinessRoomId: string
  ): Promise<ServiceResult<BusinessRoom>> {
    let result = await axios.get<ServiceResult<BusinessRoom>>(
      `${this.ApiUrl}/get-business-room-by-business-room-id/${BusinessRoomId}`,
      { withCredentials: true }
    );
    return result.data;
  }

  public static async GetAllBusinessRooms(): Promise<
    ServiceResult<BusinessRoom>
  > {
    let result = await axios.get<ServiceResult<BusinessRoom>>(
      `${this.ApiUrl}/get-all-business-rooms`,
      { withCredentials: true }
    );
    return result.data;
  }

  public static async GetAvailableBusinessRooms(): Promise<
    ServiceResult<BusinessRoom>
  > {
    let result = await axios.get<ServiceResult<BusinessRoom>>(
      `${this.ApiUrl}/get-available-business-rooms`,
      { withCredentials: true } 
    );
    return result.data;
  }
}
