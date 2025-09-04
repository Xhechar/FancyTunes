import { Payment, User } from "@prisma/client";
import { Accommodation, Booking, Cart, ChangePasswoerdDto, Delicacy, LoginDetails, Order, Recovery, Room } from "../backend.interfaces";
import { CreateAccommodationDto, CreateBookingDto, CreateCartDto, CreateDelicacyDto, CreateOrderDto, CreatePaymentDto, CreateRecoveryDto, CreateRoomDto, CreateUserDto, UpdateAccommodationDto, UpdateBookingDto, UpdateCartDto, UpdateDelicacyDto, UpdateOrderDto, UpdateRecoveryDto, UpdateRoomDto, UpdateUserDto } from "../dtos/interfaces.dtos";
import { ServiceResult } from "../service.result/service.result";

export interface IAuthService {
  loginUser(loginDetails: LoginDetails): ServiceResult<object>;
  verifyMail(Email: string): ServiceResult<object>;
  changePassword(details: ChangePasswoerdDto): ServiceResult<object>;
  logput(): void;
}

export interface IUserService {
  CreateUser(User: CreateUserDto): ServiceResult<User>;
  UpdateUser(UserId: string, User: UpdateUserDto): ServiceResult<User>;
  UpdateUserProfileImage(UserId: string, ProfileImage: string): ServiceResult<User>;
  DeleteUser(UserId: string): ServiceResult<User>;
  GetUserByUserId(UserId: string): ServiceResult<User>;
  GetAllUsers(): ServiceResult<User>;
}

export interface IRoomService {
  CreateRoom(Room: CreateRoomDto): ServiceResult<Room>;
  UpdateRoom(RoomId: string, Room: UpdateRoomDto): ServiceResult<Room>;
  DeleteRoom(RoomId: string): ServiceResult<Room>;
  GetRoomByRoomId(RoomId: string): ServiceResult<Room>;
  GetAllRooms(): ServiceResult<Room>;
}

export interface IDelicacyService {
  CreateDelicacy(Delicacy: CreateDelicacyDto): ServiceResult<Delicacy>;
  UpdateDelicacy(DelicacyId: string, Delicacy: UpdateDelicacyDto): ServiceResult<Delicacy>;
  DeleteDelicacy(DelicacyId: string): ServiceResult<Delicacy>;
  GetDelicacyByDelicacyId(DelicacyId: string): ServiceResult<Delicacy>;
  GetAllDelicacies(): ServiceResult<Delicacy>;
}

export interface IAccommodationService {
  CreateAccommodation(Accommodation: CreateAccommodationDto): ServiceResult<Accommodation>;
  UpdateAccommodation(AccommodationId: string, Accommodation: UpdateAccommodationDto): ServiceResult<Accommodation>;
  DeleteAccommodation(AccommodationId: string): ServiceResult<Accommodation>;
  GetAllAccommodations(): ServiceResult<Accommodation>;
  GetUserAccommodations(UserId: string): ServiceResult<Accommodation>;
}

export interface IOrderService {
  CreateOrder(Order: CreateOrderDto): ServiceResult<Order>;
  UpdateOrder(OrderId: string, Order: UpdateOrderDto): ServiceResult<Order>;
  DeleteOrder(OrderId: string): ServiceResult<Order>;
  GetUserOrders(UserId: string): ServiceResult<Order>;
  GetAllOrders(): ServiceResult<Order>;
  GetPaidOrders(): ServiceResult<Order>;
  GetUnpaidOrders(): ServiceResult<Order>;
  GetDeliveredOrders(): ServiceResult<Order>;
  GetUndeliveredOrders(): ServiceResult<Order>;
}

export interface IBookingService {
  CreateBooking(Booking: CreateBookingDto): ServiceResult<Booking>;
  UpdateBooking(BookingId: string, Booking: UpdateBookingDto): ServiceResult<Booking>;
  UpdateBookingStatus(BookingId: string, BookingStatus: string): ServiceResult<Booking>;
  DeleteBooking(BookingId: string): ServiceResult<Booking>;
  GetAllBookings(): ServiceResult<Booking>;
  GetUserBookings(UserId: string): ServiceResult<Booking>;
  GetActiveBookings(): ServiceResult<Booking>;
  GetInactiveBookings(): ServiceResult<Booking>;
  GetPaidBookings(): ServiceResult<Booking>;
  GetUnpaidBookings(): ServiceResult<Booking>;
}

export interface ICartService {
  CreateCart(Cart: CreateCartDto): ServiceResult<Cart>;
  UpdateCart(CartId: string, Cart: UpdateCartDto): ServiceResult<Cart>;
  IncrementCartItem(CartId: string): ServiceResult<Cart>;
  DecrementCartItem(CartId: string): ServiceResult<Cart>;
  DeleteCart(CartId: string): ServiceResult<Cart>;
  GetUserCarts(UserId: string): ServiceResult<Cart>;
  GetAllCarts(): ServiceResult<Cart>;
}

export interface IRecoveryService {
  CreateRecovery(Recovery: CreateRecoveryDto): ServiceResult<Recovery>;
  UpdateRecovery(RecoveryId: string, Recovery: UpdateRecoveryDto): ServiceResult<Recovery>;
  DeleteRecovery(RecoveryId: string): ServiceResult<Recovery>;
  GetAllRecoveries(): ServiceResult<Recovery>;
}

export interface IPaymentService {
  CreatePayment(Payment: CreatePaymentDto): ServiceResult<Payment>;
  GetUserPayments(UserId: string): ServiceResult<Payment>;
  GetAllPayments(): ServiceResult<Payment>;
  DeletePayment(PaymentId: string): ServiceResult<Payment>;
}