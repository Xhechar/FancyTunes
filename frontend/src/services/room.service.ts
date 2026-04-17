import axios from "axios";
import { BackendRoute } from "../shared/shared.data";
import { ServiceResult } from "../shared/service.result/service.result";
import { Room } from "../interfaces/interfaces";
import {
  CreateRoomDto,
  UpdateRoomDto,
} from "../interfaces/dtos/interfaces.dtos";

export class RoomsService {
  private static ApiUrl = `${BackendRoute}room`;

  static async CreateRoom(Room: CreateRoomDto): Promise<ServiceResult<Room>> {
    console.log(Room);
    
    const result = await axios.post(`${this.ApiUrl}/create-room`, Room, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Room>;
  }

  static async UpdateRoom(
    RoomId: string,
    Room: UpdateRoomDto
  ): Promise<ServiceResult<Room>> {
    const result = await axios.put(
      `${this.ApiUrl}/update-room/${RoomId}`,
      Room,
      { withCredentials: true }
    );
    return result.data as ServiceResult<Room>;
  }

  static async DeleteRoom(RoomId: string): Promise<ServiceResult<Room>> {
    const result = await axios.delete(`${this.ApiUrl}/delete-room/${RoomId}`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Room>;
  }

  static async GetRoom(RoomId: string): Promise<ServiceResult<Room>> {
    const result = await axios.get(`${this.ApiUrl}/get-room/${RoomId}`, {
      withCredentials: true
    });
    return result.data as ServiceResult<Room>;
  }

  static async GetAllRooms(): Promise<ServiceResult<Room>> {
    const result = await axios.get(`${this.ApiUrl}/get-all-rooms`, {
      withCredentials: true
    });
    return result.data as ServiceResult<Room>;
  }
}