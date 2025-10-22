import { IBookingService } from "../interfaces/abstracts/services.abstracts";
import { Booking, PrismaClient } from "@prisma/client";
import { CreateBookingDto, UpdateBookingDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { v4 } from "uuid";
import { CreateBookingSchema, UpdateBookingSchema } from "../validators/payload.validators";
import { io } from "../server";
import { EmitToSingleUser } from "../sockets/socket.io";

export class BookingService implements IBookingService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateBooking(UserId: string, BusinessRoomId: string, Booking: CreateBookingDto): Promise<ServiceResult<Booking>> {

    let { error } = CreateBookingSchema.validate(Booking);

    if (error) return ServiceResponse.failure<Booking>(ErrorCode.VALIDATION, error.details[0].message);
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (UserExists == null) return ServiceResponse.failure<Booking>(ErrorCode.NOTFOUND, "your details are not available, kindly register an account.");

    let BusinessRoomExists = await this.prisma.businessRoom.findUnique({
      where: {
        BusinessRoomId
      }
    });

    if (BusinessRoomExists == null) return ServiceResponse.failure<Booking>(ErrorCode.NOTFOUND, "business room details not found, kindly select a valid business room.");

    let CreateBooking = await this.prisma.booking.create({
      data: {
        BookingId: v4(),
        UserId,
        BusinessRoomId,
        ...Booking,
        BookingStatus: "complete",
        PaymentStatus: "paid"
      }
    });

    if (CreateBooking == null) return ServiceResponse.failure<Booking>(ErrorCode.SERVER, "unable to create booking at the moment, kindly try again later.");

    let DecreaseRoomCount = await this.prisma.businessRoom.update({
      where: {
        BusinessRoomId
      },
      data: {
        RoomCount: { decrement: 1 }
      }
    });

    if (DecreaseRoomCount == null) return ServiceResponse.failure<Booking>(ErrorCode.SERVER, "unable to update room count at the moment, kindly try again later.");

    io.emit("business-room-updated", DecreaseRoomCount);

    EmitToSingleUser(io, UserId, "booking-created", CreateBooking);

    return ServiceResponse.success<Booking>("booking created successfully.");
  }

  async UpdateBooking(UserId: string, BookingId: string, Booking: UpdateBookingDto): Promise<ServiceResult<Booking>> {
    
    let { error } = UpdateBookingSchema.validate(Booking);

    if (error) return ServiceResponse.failure<Booking>(ErrorCode.VALIDATION, error.details[0].message);

    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (UserExists == null) return ServiceResponse.failure<Booking>(ErrorCode.NOTFOUND, "your details are not available, kindly register an account.");

    let BookingExists = await this.prisma.booking.findUnique({
      where: {
        BookingId,
        UserId
      }
    });

    if (BookingExists == null) return ServiceResponse.failure<Booking>(ErrorCode.NOTFOUND, "booking details not found, kindly provide a valid booking.");

    let UpdateBooking = await this.prisma.booking.update({
      where: {
        BookingId
      },
      data: {
        ...Booking
      }
    });

    if (UpdateBooking == null) return ServiceResponse.failure<Booking>(ErrorCode.SERVER, "unable to update booking details at the moment, kindly try again later.");

    EmitToSingleUser(io, UserId, "booking-updated", UpdateBooking);

    return ServiceResponse.success<Booking>("booking details updated successfully.");
  }

  async CompleteBookingPayment(UserId: string, BookingId: string): Promise<ServiceResult<Booking>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (UserExists == null) return ServiceResponse.failure<Booking>(ErrorCode.NOTFOUND, "your details are not available, kindly register an account.");

    let BookingExists = await this.prisma.booking.findUnique({
      where: {
        BookingId,
        UserId
      }
    });

    if (BookingExists == null) return ServiceResponse.failure<Booking>(ErrorCode.NOTFOUND, "booking details not found, kindly provide a valid booking.");

    //paynent gateway integration here
    return ServiceResponse.success<Booking>("payment completed successfully."); //
  }

  async UpdateBookingStatus(BookingId: string, BookingStatus: string): Promise<ServiceResult<Booking>> {
    
    let BookingExists = await this.prisma.booking.findUnique({
      where: {
        BookingId
      }
    });

    if (BookingExists == null) return ServiceResponse.failure<Booking>(ErrorCode.NOTFOUND, "booking details not found, kindly provide a valid booking.");

    let UpdateBookingStatus = await this.prisma.booking.update({
      where: {
        BookingId
      },
      data: {
        BookingStatus
      }
    });

    if (UpdateBookingStatus == null) return ServiceResponse.failure<Booking>(ErrorCode.SERVER, "unable to update booking status at the moment, kindly try again later.");

    return ServiceResponse.success<Booking>("booking status updated successfully.");
  }
  async DeleteBooking(BookingId: string): Promise<ServiceResult<Booking>> {
    
    let BookingExists = await this.prisma.booking.findUnique({
      where: {
        BookingId
      }
    });

    if (BookingExists == null) return ServiceResponse.failure<Booking>(ErrorCode.NOTFOUND, "booking details not found, kindly provide a valid booking.");

    let DeleteBooking = await this.prisma.booking.delete({
      where: {
        BookingId
      }
    });

    if (DeleteBooking == null) return ServiceResponse.failure<Booking>(ErrorCode.SERVER, "unable to delete booking at the moment, kindly try again later.");

    io.emit("booking-deleted", DeleteBooking);

    return ServiceResponse.success<Booking>("booking deleted successfully.");
  }
  async GetAllBookings(): Promise<ServiceResult<Booking>> {
    
    let AllBookings = await this.prisma.booking.findMany({
      orderBy: {
        CreatedAt: "desc"
      },
      include: {
        User: true,
        BusinessRoom: true
      }
    });

    if (AllBookings == null || AllBookings.length == 0) return ServiceResponse.failure<Booking>(ErrorCode.EMPTY, "no booking records available at the moment.");

    return ServiceResponse.success<Booking>("bookings retrieved successfully.", undefined, AllBookings);
  }
  async GetUserBookings(UserId: string): Promise<ServiceResult<Booking>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (UserExists == null) return ServiceResponse.failure<Booking>(ErrorCode.NOTFOUND, "your details are not available, kindly register an account.");

    let UserBookings = await this.prisma.booking.findMany({
      where: {
        UserId
      },
      orderBy: {
        CreatedAt: "desc"
      },
      include: {
        BusinessRoom: true
      }
    });

    if (UserBookings == null || UserBookings.length == 0) return ServiceResponse.failure<Booking>(ErrorCode.EMPTY, "you have no booking records available at the moment.");

    return ServiceResponse.success<Booking>("your bookings retrieved successfully.", undefined, UserBookings);
  }
  async GetActiveBookings(): Promise<ServiceResult<Booking>> {
    
    let ActiveBookings = await this.prisma.booking.findMany({
      where: {
        BookingStatus: "active"
      },
      orderBy: {
        CreatedAt: "desc"
      },
      include: {
        User: true,
        BusinessRoom: true
      }
    });

    if (ActiveBookings == null || ActiveBookings.length == 0) return ServiceResponse.failure<Booking>(ErrorCode.EMPTY, "no active booking records available at the moment.");

    return ServiceResponse.success<Booking>("active bookings retrieved successfully.", undefined, ActiveBookings);
  }
  async GetInactiveBookings(): Promise<ServiceResult<Booking>> {
    
    let InactiveBookings = await this.prisma.booking.findMany({
      where: {
        BookingStatus: "pending"
      },
      orderBy: {
        CreatedAt: "desc"
      },
      include: {
        User: true,
        BusinessRoom: true
      }
    });

    if (InactiveBookings == null || InactiveBookings.length == 0) return ServiceResponse.failure<Booking>(ErrorCode.EMPTY, "no inactive booking records available at the moment.");

    return ServiceResponse.success<Booking>("inactive bookings retrieved successfully.", undefined, InactiveBookings);
  }
  async GetPaidBookings(): Promise<ServiceResult<Booking>> {
    
    let PaidBookings = await this.prisma.booking.findMany({
      where: {
        PaymentStatus: "paid"
      },
      orderBy: {
        CreatedAt: "desc"
      },
      include: {
        User: true,
        BusinessRoom: true
      }
    });

    if (PaidBookings == null || PaidBookings.length == 0) return ServiceResponse.failure<Booking>(ErrorCode.EMPTY, "no paid booking records available at the moment.");

    return ServiceResponse.success<Booking>("paid bookings retrieved successfully.", undefined, PaidBookings);
  }
  async GetUnpaidBookings(): Promise<ServiceResult<Booking>> {
    
    let UnpaidBookings = await this.prisma.booking.findMany({
      where: {
        PaymentStatus: "unpaid"
      },
      orderBy: {
        CreatedAt: "desc"
      },
      include: {
        User: true,
        BusinessRoom: true
      }
    });

    if (UnpaidBookings == null || UnpaidBookings.length == 0) return ServiceResponse.failure<Booking>(ErrorCode.EMPTY, "no unpaid booking records available at the moment.");

    return ServiceResponse.success<Booking>("unpaid bookings retrieved successfully.", undefined, UnpaidBookings);
  }
}