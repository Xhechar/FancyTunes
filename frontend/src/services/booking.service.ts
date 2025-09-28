import axios from "axios";
import { BackendRoute } from "../shared/shared.data";
import { ServiceResult } from "../shared/service.result/service.result";
import { Booking } from "../interfaces/interfaces";
import { UpdateBookingDto } from "../interfaces/dtos/interfaces.dtos";

export class BookingService {
  private static readonly ApiUrl = `${BackendRoute}booking`;

  public static async UpdateBooking(
    BookingId: string,
    Booking: UpdateBookingDto
  ): Promise<ServiceResult<Booking>> {
    let result = await axios.put<ServiceResult<Booking>>(
      `${this.ApiUrl}/update-booking/${BookingId}`,
      Booking,
      { withCredentials: true }
    );
    return result.data;
  }

  public static async UpdateBookingStatus(
    BookingId: string,
    BookingStatus: string
  ): Promise<ServiceResult<Booking>> {
    let result = await axios.put<ServiceResult<Booking>>(
      `${this.ApiUrl}/update-booking-status/${BookingId}`,
      { BookingStatus: BookingStatus },
      { withCredentials: true }
    );
    return result.data;
  }

  public static async DeleteBooking(
    BookingId: string
  ): Promise<ServiceResult<boolean>> {
    let result = await axios.delete<ServiceResult<boolean>>(
      `${this.ApiUrl}/delete-booking/${BookingId}`,
      { withCredentials: true }
    );
    return result.data;
  }

  public static async GetAllBookings(): Promise<ServiceResult<Booking>> {
    let result = await axios.get<ServiceResult<Booking>>(
      `${this.ApiUrl}/get-all-bookings`,
      { withCredentials: true }
    );
    return result.data;
  }

  public static async GetUserBookings(): Promise<ServiceResult<Booking>> {
    let result = await axios.get<ServiceResult<Booking>>(
      `${this.ApiUrl}/get-user-bookings`,
      { withCredentials: true }
    );
    return result.data;
  }

  public static async GetActiveBookings(): Promise<ServiceResult<Booking>> {
    let result = await axios.get<ServiceResult<Booking>>(
      `${this.ApiUrl}/get-active-bookings`,
      { withCredentials: true }
    );
    return result.data;
  }

  public static async GetInactiveBookings(): Promise<ServiceResult<Booking>> {
    let result = await axios.get<ServiceResult<Booking>>(
      `${this.ApiUrl}/get-inactive-bookings`,
      { withCredentials: true }
    );
    return result.data;
  }

  public static async GetPaidBookings(): Promise<ServiceResult<Booking>> {
    let result = await axios.get<ServiceResult<Booking>>(
      `${this.ApiUrl}/get-paid-bookings`,
      { withCredentials: true }
    );
    return result.data;
  }

  public static async GetUnpaidBookings(): Promise<ServiceResult<Booking>> {
    let result = await axios.get<ServiceResult<Booking>>(
      `${this.ApiUrl}/get-unpaid-bookings`,
      { withCredentials: true }
    );
    return result.data;
  }
}
