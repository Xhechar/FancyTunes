import { Request, Response } from "express";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { BookingService } from "../services/booking.service";
import { getUserIdFromToken } from "../middlewares/backend.middleware";

export class BookingController {

  private bookingService: BookingService = new BookingService();

  async UpdateBooking(Req: Request, Res: Response) {
    try {

      let result = await this.bookingService.UpdateBooking(getUserIdFromToken(Req), Req.params.BookingId, Req.body);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }

  async UpdateBookingStatus(Req: Request, Res: Response) {
    try {

      let result = await this.bookingService.UpdateBookingStatus(Req.params.BookingId, Req.body.BookingStatus);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async DeleteBooking(Req: Request, Res: Response) {
    try {

      let result = await this.bookingService.DeleteBooking(Req.params.BookingId);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetAllBookings(Req: Request, Res: Response) {
    try {

      let result = await this.bookingService.GetAllBookings();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetUserBookings(Req: Request, Res: Response) {
    try {

      let result = await this.bookingService.GetUserBookings(getUserIdFromToken(Req));
      
      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetActiveBookings(Req: Request, Res: Response) {
    try {

      let result = await this.bookingService.GetActiveBookings();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetInactiveBookings(Req: Request, Res: Response) {
    try {

      let result = await this.bookingService.GetInactiveBookings();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetPaidBookings(Req: Request, Res: Response) {
    try {

      let result = await this.bookingService.GetPaidBookings();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetUnpaidBookings(Req: Request, Res: Response) {
    try {

      let result = await this.bookingService.GetUnpaidBookings();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  
}