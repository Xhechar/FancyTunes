import { Payment, PrismaClient } from "@prisma/client";
import { IPaymentService } from "../interfaces/abstracts/services.abstracts";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { StkPushResponse } from "../interfaces/backend.interfaces";
import { SendSTKPush } from "../utils/safaricom.stk.push";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { CreatePaymentData } from "../interfaces/backend.interfaces";
import { SharedDataService } from "../shared/shared.service.data";
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
        let DelicacyExists = await this.prisma.delicacy.findUnique({
          where: {
            DelicacyId: CommodityId
          }
        });

        if(!DelicacyExists) return ServiceResponse.failure<Payment>(ErrorCode.NOTFOUND, "delicacy specified does not exist");
      }
      break;

      default: return ServiceResponse.failure<Payment>(ErrorCode.VALIDATION, "service type passed is invalid");
    }
    
    const Data: StkPushResponse = await SendSTKPush({Amount: PaymentData.Amount, PhoneNumber: UserExists.Phone});

    if (Data.ResponseCode == "0") {
      
      SharedDataService.SharedData = {
        ServiceType: PaymentData.ServiceType,
        Amount: PaymentData.Amount,
        UserId,
        CommodityId,
        Accommodation: PaymentData.Accommodation ? PaymentData.Accommodation : undefined,
        Booking: PaymentData.Booking ? PaymentData.Booking : undefined
      };

      return ServiceResponse.success<Payment>(Data.ResponseDescription);
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

  async MpesaCallback(SafaricomvResponse: any): Promise<void> {
    
    if(lodash.isEmpty(SharedDataService.SharedData)) {
      console.log("Shared Data Service Has no data.");
    }

    switch(SharedDataService.SharedData.ServiceType) {
      case TypeService.ACCOMMODATION : {
        let Result = await AccService.CreateAccommodation(SharedDataService.SharedData.UserId, SharedDataService.SharedData.CommodityId, SharedDataService.SharedData.Accommodation as CreateAccommodationDto);

        if (Result.success) {

          let ItemArray = SafaricomvResponse.Body.stkCallback.CallbackMetadata.Item;
          
          let PaymentData: CreatePaymentDto = {
            Amount: ItemArray[0].Value,
            PaymentMethod: "Safaricom MPESA",
            PaymentReference: ItemArray[1].Value,
            ResultDescription: SafaricomvResponse.Body.stkCallback.ResultDesc,
            Status: SafaricomvResponse.Body.stkCallback.ResultCode,
            PaidAt: ItemArray[3].Value,
            AccommodationId: SharedDataService.SharedData.CommodityId
          };

          await this.SavePaymentData(SharedDataService.SharedData.UserId, PaymentData);
        }
      }
      break;

      case TypeService.BOOKING : {
        
        let Result = await BKService.CreateBooking(SharedDataService.SharedData.UserId, SharedDataService.SharedData.CommodityId, SharedDataService.SharedData.Booking as CreateBookingDto);

        if (Result.success) {

          let ItemArray = SafaricomvResponse.Body.stkCallback.CallbackMetadata.Item;

          let PaymentData: CreatePaymentDto = {
            Amount: ItemArray[0].Value,
            PaymentMethod: "Safaricom MPESA",
            PaymentReference: ItemArray[1].Value,
            ResultDescription: SafaricomvResponse.Body.stkCallback.ResultDesc,
            Status: SafaricomvResponse.Body.stkCallback.ResultCode,
            PaidAt: ItemArray[3].Value,
            BookingId: Result.data?.BookingId
          };

          await this.SavePaymentData(SharedDataService.SharedData.UserId, PaymentData);
        }
      }
      break;

      case TypeService.ORDER : {

        let Result = await OrdService.CreateOrder(SharedDataService.SharedData.UserId);

        if (Result.success) {
          
          let ItemArray = SafaricomvResponse.Body.stkCallback.CallbackMetadata.Item;

          let PaymentData: CreatePaymentDto = {
            Amount: ItemArray[0].Value,
            PaymentMethod: "Safaricom MPESA",
            PaymentReference: ItemArray[1].Value,
            ResultDescription: SafaricomvResponse.Body.stkCallback.ResultDesc,
            Status: SafaricomvResponse.Body.stkCallback.ResultCode,
            PaidAt: ItemArray[3].Value,
            OrderId: Result.data?.OrderId
          };

          await this.SavePaymentData(SharedDataService.SharedData.UserId, PaymentData);
        }

      }
      break;

      default:
    }
  }
}