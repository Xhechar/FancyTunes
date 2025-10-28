import { Payment, PrismaClient } from "@prisma/client";
import { IPaymentService } from "../interfaces/abstracts/services.abstracts";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { StkPushResponse } from "../interfaces/backend.interfaces";
import { SendSTKPush } from "../utils/safaricom.stk.push";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { CreatePaymentData } from "../interfaces/backend.interfaces";
import lodash from 'lodash';
import { TypeService } from "../interfaces/enum/service.type.enum";
import { AccommodationsService } from "./accommodations.service";
import { CreateAccommodationDto, CreateBookingDto, CreatePaymentDto } from "../interfaces/dtos/interfaces.dtos";
import { io } from "../server";
import { v4 } from "uuid";
import { BookingService } from "./booking.service";
import { OrderService } from "./order.service";
import { EmitToSingleUser } from "../sockets/socket.io";

let AccService = new AccommodationsService();
let BKService = new BookingService();
let OrdService = new OrderService();

export class PaymentService implements IPaymentService {

  private prisma = new PrismaClient({
    log: ["error"]
  });
  
  async CreatePayment(UserId: string, CommodityId: string, PaymentData: CreatePaymentData): Promise<ServiceResult<Payment>> {

    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (!UserExists) return ServiceResponse.failure<Payment>(ErrorCode.NOTFOUND, "your details are not available at the monent.");

    switch(PaymentData.ServiceType) {
      
      case TypeService.ACCOMMODATION : {
        let RoomExists = await this.prisma.room.findUnique({
          where: {
            RoomId: CommodityId
          }
        });

        if (!RoomExists) return ServiceResponse.failure<Payment>(ErrorCode.NOTFOUND, "room specified does not exist");
      }
      break;

      case TypeService.BOOKING : {
        let BusinessRoomExists = await this.prisma.businessRoom.findUnique({
          where: {
            BusinessRoomId: CommodityId
          }
        });

        if (!BusinessRoomExists) return ServiceResponse.failure<Payment>(ErrorCode.NOTFOUND, "business room specified does not exist");
      }
      break;

      case TypeService.ORDER : {
        //
      }
      break;

      default: return ServiceResponse.failure<Payment>(ErrorCode.VALIDATION, "service type passed is invalid");
    }
    
    const Data: StkPushResponse = await SendSTKPush({Amount: PaymentData.Amount, PhoneNumber: UserExists.Phone});

    if (Data.ResponseCode == "0") {
      
      if(PaymentData.ServiceType === TypeService.ACCOMMODATION) {
        let CreateSharedData = await this.prisma.paymentSharedData.create({
          data: {
            PaymentSharedDataId: v4(),
            UserId,
            CommodityId,
            Amount: PaymentData.Amount,
            ServiceType: PaymentData.ServiceType,
            CheckInDate: PaymentData.Accommodation?.CheckInDate,
            CheckOutDate: PaymentData.Accommodation?.CheckOutDate,
            SpecialRequestsAccommodation: PaymentData.Accommodation?.SpecialRequests
          }
        });

        if (CreateSharedData) return ServiceResponse.success<Payment>(Data.ResponseDescription);

        else return ServiceResponse.failure<Payment>(ErrorCode.SERVER, "unable to create payment data, kindly retry payment");
      } else if (PaymentData.ServiceType === TypeService.BOOKING) {
        let CreateSharedData = await this.prisma.paymentSharedData.create({
          data: {
            PaymentSharedDataId: v4(),
            UserId,
            CommodityId,
            Amount: PaymentData.Amount,
            ServiceType: PaymentData.ServiceType,
            NumberOfGuests: PaymentData.Booking?.NumberOfGuests,
            DurationInHours: PaymentData.Booking?.DurationInHours,
            BookingDate: PaymentData.Booking?.BookingDate,
            TotalAmount: PaymentData.Booking?.TotalAmount,
            SpecialRequestsBooking: PaymentData.Booking?.SpecialRequests
          }
        });

        if (CreateSharedData) return ServiceResponse.success<Payment>(Data.ResponseDescription);

        else return ServiceResponse.failure<Payment>(ErrorCode.SERVER, "unable to create payment data, kindly retry payment");
      } else {
        let CreateSharedData = await this.prisma.paymentSharedData.create({
          data: {
            PaymentSharedDataId: v4(),
            UserId,
            CommodityId,
            Amount: PaymentData.Amount,
            ServiceType: PaymentData.ServiceType
          }
        });

        if (CreateSharedData) return ServiceResponse.success<Payment>(Data.ResponseDescription);

        else return ServiceResponse.failure<Payment>(ErrorCode.SERVER, "unable to create payment data, kindly retry payment");
      }
      
    }
      
    return ServiceResponse.failure<Payment>(ErrorCode.CLIENT, Data.ResponseDescription);
  }

  async SavePaymentData(UserId: string, Payment: CreatePaymentDto) {

    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (!UserExists) return ServiceResponse.failure<Payment>(ErrorCode.NOTFOUND, "your details are not available at the monent.");

    let CreatePayment = await this.prisma.payment.create({
      data: {
        PaymentId: v4(),
        UserId,
        ...Payment
      }
    });

    if(!CreatePayment) return ServiceResponse.failure<Payment>(ErrorCode.SERVER, "unable to complete payment at the moment.");

    EmitToSingleUser(io, UserId,  "payment-created", CreatePayment);

    return ServiceResponse.success("payment completed successfully.")
  }

  async GetUserPayments(UserId: string): Promise<ServiceResult<Payment>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (!UserExists) return ServiceResponse.failure<Payment>(ErrorCode.NOTFOUND, "your details are not available at the monent.");

    let Payments = await this.prisma.payment.findMany({
      where: {
        UserId
      },
      orderBy: {
        CreatedAt: "desc"
      },
      include: {
        Accommodation: true,
        Booking: true,
        Order: true
      }
    });

    if (!Payments) return ServiceResponse.failure<Payment>(ErrorCode.SERVER, "unable to fetch your payments at the moment.");

    return ServiceResponse.success<Payment>("your payments fetched successfully", undefined, Payments);
  }

  async GetAllPayments(): Promise<ServiceResult<Payment>> {
    
    let Payments = await this.prisma.payment.findMany({
      orderBy: {
        CreatedAt: "desc"
      },
      include: {
        User: true,
        Accommodation: true,
        Booking: true,
        Order: true
      }
    });

    if (!Payments) return ServiceResponse.failure<Payment>(ErrorCode.SERVER, "unable to fetch payments at the moment.");

    return ServiceResponse.success<Payment>("payments fetched successfully", undefined, Payments);
  }

  async DeletePayment(PaymentId: string): Promise<ServiceResult<Payment>> {
    
    let PaymentExists = await this.prisma.payment.findUnique({
      where: {
        PaymentId
      }
    });

    if (!PaymentExists) return ServiceResponse.failure<Payment>(ErrorCode.NOTFOUND, "payment specified does not exist");

    let DeletePayment = await this.prisma.payment.delete({
      where: {
        PaymentId
      }
    });

    if (!DeletePayment) return ServiceResponse.failure<Payment>(ErrorCode.SERVER, "unable to delete payment at the moment");

    EmitToSingleUser(io, PaymentExists.UserId, "payment-deleted", DeletePayment);

    return ServiceResponse.success<Payment>("payment deleted successfully");
  }
  
  async MpesaCallback(SafaricomResponse: any): Promise<void> {

    if (SafaricomResponse.Body.stkCallback.ResultCode != 0) {

      let UserExists = await this.prisma.user.findUnique({
        where: {
          Phone: SafaricomResponse.Body.stkCallback.CallbackMetadata.Item[4].Value
        },
        include: {
          PaymentSharedData: {
            where: {
              IsUsed: false,
            },
            orderBy: {
              CreatedAt: "asc"
            }
          }
        }
      });

      if(!UserExists) {
        console.log("user to recieve payment response not found.");
        return;
      }

      await this.prisma.paymentSharedData.update({
        data: {
          IsUsed: true,
        },
        where: {
          PaymentSharedDataId: UserExists?.PaymentSharedData[0].PaymentSharedDataId,
          UserId: UserExists.UserId,
        },
      });
    }

    let ItemArray = SafaricomResponse.Body.stkCallback.CallbackMetadata.Item;

    let UserExists = await this.prisma.user.findUnique({
      where: {
        Phone: ItemArray[4].Value,
      },
      include: {
        PaymentSharedData: {
          where: {
            IsUsed: false
          },
          orderBy: {
            CreatedAt: "asc"
          }
        }
      }
    });

    if(lodash.isEmpty(UserExists)) {
      console.log("user to recieve payment response not found.");
      return;
    }

    let PaymentSharedData = UserExists.PaymentSharedData[0];

    switch(PaymentSharedData.ServiceType) {
      case TypeService.ACCOMMODATION : {

        if (!PaymentSharedData.CheckInDate || !PaymentSharedData.CheckOutDate) {
          console.log("missing check-in or check-out dates in payment shared data");
          return;
        }

        const NewAccomodation: CreateAccommodationDto = {
          CheckInDate: PaymentSharedData.CheckInDate,
          CheckOutDate: PaymentSharedData.CheckOutDate,
          SpecialRequests: PaymentSharedData.SpecialRequestsAccommodation ?? ""
        };

        let Result = await AccService.CreateAccommodation(UserExists.UserId, PaymentSharedData.CommodityId, NewAccomodation);

        if (Result.success) {
          let PaymentData: CreatePaymentDto = {
            Amount: ItemArray[0].Value,
            PaymentMethod: "Safaricom MPESA",
            PaymentReference: ItemArray[1].Value,
            ResultDescription: SafaricomResponse.Body.stkCallback.ResultDesc,
            Status: SafaricomResponse.Body.stkCallback.ResultCode,
            PaidAt: ItemArray[3].Value,
            AccommodationId: Result.data?.AccommodationId
          };

          (await this.prisma.paymentSharedData.update({
            data: {
              IsUsed: true
            },
            where: {
              PaymentSharedDataId: PaymentSharedData.PaymentSharedDataId,
              UserId: UserExists.UserId
            }
          }));

          let SavePayment = await this.SavePaymentData(
            UserExists.UserId,
            PaymentData
          );

          if (!SavePayment.success)
            console.log("unable to create payment for accommodation");
        }
      }
      break;

      case TypeService.BOOKING : {

        if (!PaymentSharedData.BookingDate || !PaymentSharedData.NumberOfGuests || !PaymentSharedData.DurationInHours || !PaymentSharedData.TotalAmount) {
          console.log("missing essential booking data");
          return;
        }

        let NewBooking: CreateBookingDto = {
          NumberOfGuests: PaymentSharedData.NumberOfGuests,
          DurationInHours: PaymentSharedData.DurationInHours,
          BookingDate: PaymentSharedData.BookingDate,
          TotalAmount: PaymentSharedData.TotalAmount,
          SpecialRequests: PaymentSharedData.SpecialRequestsBooking ?? ""
        };
        
        let Result = await BKService.CreateBooking(UserExists.UserId, PaymentSharedData.CommodityId, NewBooking);

        if (Result.success) {

          let ItemArray = SafaricomResponse.Body.stkCallback.CallbackMetadata.Item;

          let PaymentData: CreatePaymentDto = {
            Amount: ItemArray[0].Value,
            PaymentMethod: "Safaricom MPESA",
            PaymentReference: ItemArray[1].Value,
            ResultDescription: SafaricomResponse.Body.stkCallback.ResultDesc,
            Status: SafaricomResponse.Body.stkCallback.ResultCode,
            PaidAt: ItemArray[3].Value,
            BookingId: Result.data?.BookingId
          };

          await this.prisma.paymentSharedData.update({
            data: {
              IsUsed: true,
            },
            where: {
              PaymentSharedDataId: PaymentSharedData.PaymentSharedDataId,
              UserId: UserExists.UserId,
            },
          });

          let SavePayment = await this.SavePaymentData(
            UserExists.UserId,
            PaymentData
          );

          if (!SavePayment.success)
            console.log("unable to create payment for booking");
        }
      }
      break;

      case TypeService.ORDER : {

        let Result = await OrdService.CreateOrder(UserExists.UserId);

        if (Result.success) {
          
          let ItemArray = SafaricomResponse.Body.stkCallback.CallbackMetadata.Item;

          let PaymentData: CreatePaymentDto = {
            Amount: ItemArray[0].Value,
            PaymentMethod: "Safaricom MPESA",
            PaymentReference: ItemArray[1].Value,
            ResultDescription: SafaricomResponse.Body.stkCallback.ResultDesc,
            Status: SafaricomResponse.Body.stkCallback.ResultCode,
            PaidAt: ItemArray[3].Value,
            OrderId: Result.data?.OrderId
          };

          await this.prisma.paymentSharedData.update({
            data: {
              IsUsed: true,
            },
            where: {
              PaymentSharedDataId: PaymentSharedData.PaymentSharedDataId,
              UserId: UserExists.UserId,
            },
          });

          let SavePayment = await this.SavePaymentData(UserExists.UserId, PaymentData);

          if(!SavePayment.success) console.log("unable to create payment for order");
        }

      }
      break;

      default: return;
    }
  }
}