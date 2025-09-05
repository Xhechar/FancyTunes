import { IBookingService } from "../interfaces/abstracts/services.abstracts";
import { Booking, PrismaClient } from "@prisma/client";
import { CreateBookingDto, UpdateBookingDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";

export class BookingService implements IBookingService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateBooking(Booking: CreateBookingDto): Promise<ServiceResult<Booking>> {
    throw new Error("Method not implemented.");
  }
  async UpdateBooking(BookingId: string, Booking: UpdateBookingDto): Promise<ServiceResult<Booking>> {
    throw new Error("Method not implemented.");
  }
  async UpdateBookingStatus(BookingId: string, BookingStatus: string): Promise<ServiceResult<Booking>> {
    throw new Error("Method not implemented.");
  }
  async DeleteBooking(BookingId: string): Promise<ServiceResult<Booking>> {
    throw new Error("Method not implemented.");
  }
  async GetAllBookings(): Promise<ServiceResult<Booking>> {
    throw new Error("Method not implemented.");
  }
  async GetUserBookings(UserId: string): Promise<ServiceResult<Booking>> {
    throw new Error("Method not implemented.");
  }
  async GetActiveBookings(): Promise<ServiceResult<Booking>> {
    throw new Error("Method not implemented.");
  }
  async GetInactiveBookings(): Promise<ServiceResult<Booking>> {
    throw new Error("Method not implemented.");
  }
  async GetPaidBookings(): Promise<ServiceResult<Booking>> {
    throw new Error("Method not implemented.");
  }
  async GetUnpaidBookings(): Promise<ServiceResult<Booking>> {
    throw new Error("Method not implemented.");
  }
}