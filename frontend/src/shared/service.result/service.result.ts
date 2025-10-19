
export interface ServiceResult<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  dataList?: T[];
  token?: string;
  role?: string;
}
