import { string } from "joi";
import { TokenDetails } from "../utils/token.details";
import { ServiceResult } from "./service.result";

export class ServiceResponse<T> {
  static success<T>(
    message: string,
    data?: T,
    dataList?: T[]
  ): ServiceResult<T> {
    return {
      success: true,
      message: message,
      data: data,
      dataList: dataList,
    };
  }

  static failure<T>(message: string, error: string): ServiceResult<T> {
    return {
      success: false,
      message: message,
      error: error,
    };
  }

  static auth<T>(token: string, role: string): ServiceResult<T> {
    return {
      success: true,
      message: "login successfull.",
      token,
      role
    };
  }
}
