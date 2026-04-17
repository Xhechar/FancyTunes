import axios from "axios";
import { BackendRoute } from "../shared/shared.data";
import { ServiceResult } from "../shared/service.result/service.result";
import { Delicacy } from "../interfaces/interfaces";
import {
  CreateDelicacyDto,
  UpdateDelicacyDto,
} from "../interfaces/dtos/interfaces.dtos";

export class DelicacyService {
  private static ApiUrl = `${BackendRoute}delicacy`;

  static async CreateDelicacy(
    Delicacy: CreateDelicacyDto
  ): Promise<ServiceResult<Delicacy>> {
    const result = await axios.post(
      `${this.ApiUrl}/create-delicacy`,
      Delicacy,
      { withCredentials: true } 
    );
    return result.data as ServiceResult<Delicacy>;
  }

  static async UpdateDelicacy(
    DelicacyId: string,
    Delicacy: UpdateDelicacyDto
  ): Promise<ServiceResult<Delicacy>> {
    const result = await axios.put(
      `${this.ApiUrl}/update-delicacy/${DelicacyId}`,
      Delicacy,
      { withCredentials: true }
    );
    return result.data as ServiceResult<Delicacy>;
  }

  static async DeleteDelicacy(
    DelicacyId: string
  ): Promise<ServiceResult<Delicacy>> {
    const result = await axios.delete(
      `${this.ApiUrl}/delete-delicacy/${DelicacyId}`,
      { withCredentials: true }
    );
    return result.data as ServiceResult<Delicacy>;
  }

  static async GetDelicacyByDelicacyId(
    DelicacyId: string
  ): Promise<ServiceResult<Delicacy>> {
    const result = await axios.get(
      `${this.ApiUrl}/get-delicacy/${DelicacyId}`,
      { withCredentials: true }
    );
    return result.data as ServiceResult<Delicacy>;
  }

  static async GetAllDelicacies(): Promise<ServiceResult<Delicacy>> {
    const result = await axios.get(`${this.ApiUrl}/get-all-delicacies`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Delicacy>;
  }

  static async GetAvailableDelicacies(): Promise<ServiceResult<Delicacy>> {
    const result = await axios.get(`${this.ApiUrl}/get-available-delicacies`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Delicacy>;
  }

  static async GetDelicaciesByCategory(
    category: string
  ): Promise<ServiceResult<Delicacy>> {
    const result = await axios.post(
      `${this.ApiUrl}/get-delicacies-by-category`,
      { category },
      { withCredentials: true }
    );
    return result.data as ServiceResult<Delicacy>;
  }
}
