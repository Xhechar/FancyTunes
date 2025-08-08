import { TokenDetails } from "../utilities/token.details";

export interface ServiceResult<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  dataList?: T[];
  tokenData?: TokenDetails;
}
