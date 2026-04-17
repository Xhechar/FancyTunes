import axios from "axios";
import { UpdateAccommodationDto } from "../interfaces/dtos/interfaces.dtos";
import { BackendRoute } from "../shared/shared.data";
import { ServiceResult } from "../shared/service.result/service.result";
import { Accommodation } from "../interfaces/interfaces";

export class AccommodationService {
  private static ApiUrl = `${BackendRoute}accommodation/`;

  static async UpdateAccommodation(
    AccommodationId: string,
    Accommodation: UpdateAccommodationDto 
  ): Promise<ServiceResult<Accommodation>> {
    let result = await axios.put(
      `${this.ApiUrl}/update-accommodation/${AccommodationId}`,
      Accommodation,
      { withCredentials: true }
    );

    return result as unknown as ServiceResult<Accommodation>;
  }

  static async DeleteAccommodation(
    accommodationId: string
  ): Promise<ServiceResult<boolean>> {
    let result = await axios.delete<ServiceResult<boolean>>(
      `${this.ApiUrl}/delete-accommodation/${accommodationId}`,
      { withCredentials: true }
    );
    return result.data;
  }

  static async GetAllAccommodations(): Promise<ServiceResult<Accommodation[]>> {
    let result = await axios.get<ServiceResult<Accommodation[]>>(
      `${this.ApiUrl}/get-all-accommodations`,
      { withCredentials: true }
    );
    return result.data;
  }

  static async GetUserAccommodations(): Promise<ServiceResult<Accommodation[]>> {
    let result = await axios.get<ServiceResult<Accommodation[]>>(
      `${this.ApiUrl}/get-user-accommodations`,
      { withCredentials: true }
    );
    return result.data;
  }
}