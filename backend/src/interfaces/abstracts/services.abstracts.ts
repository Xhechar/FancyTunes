import { Accommodation, Booking, Cart, Delicacy, Order, Payment, Recovery, Review, Room, User } from "@prisma/client";
import { CreateAccommodationDto, CreateBookingDto, CreateCartDto, CreateDelicacyDto, CreateNotificationDto, CreateOrderDto, CreatePaymentDto, CreateRecoveryDto, CreateReviewDto, CreateRoomDto, CreateUserDto, UpdateAccommodationDto, UpdateBookingDto, UpdateCartDto, UpdateDelicacyDto, UpdateOrderDto, UpdateRoomDto, UpdateUserDto } from "../dtos/interfaces.dtos";
import { ServiceResult } from "../service.result/service.result";
import { LoginDetails, ChangePasswoerdDto } from "../backend.interfaces";

export interface IAuthService {
  loginUser(loginDetails: LoginDetails): Promise<ServiceResult<object>>;
  verifyMail(Email: string): Promise<ServiceResult<object>>;
  changePassword(details: ChangePasswoerdDto): Promise<ServiceResult<object>>;
  logput(): void;
}

export interface IUserService {
  CreateUser(User: CreateUserDto): Promise<ServiceResult<User>>;
  UpdateUser(UserId: string, User: UpdateUserDto): Promise<ServiceResult<User>>;
  UpdateUserProfileImage(UserId: string, ProfileImage: string): Promise<ServiceResult<User>>;
  DeleteUser(UserId: string): Promise<ServiceResult<User>>;
  GetUserByUserId(UserId: string): Promise<ServiceResult<User>>;
  GetAllUsers(): Promise<ServiceResult<User>>;
}

export interface IRoomService {
  CreateRoom(Room: CreateRoomDto): Promise<ServiceResult<Room>>;
  UpdateRoom(RoomId: string, Room: UpdateRoomDto): Promise<ServiceResult<Room>>;
  DeleteRoom(RoomId: string): Promise<ServiceResult<Room>>;
  GetRoomByRoomId(RoomId: string): Promise<ServiceResult<Room>>;
  GetAllRooms(): Promise<ServiceResult<Room>>;
}

export interface IDelicacyService {
  CreateDelicacy(Delicacy: CreateDelicacyDto): Promise<ServiceResult<Delicacy>>;
  UpdateDelicacy(DelicacyId: string, Delicacy: UpdateDelicacyDto): Promise<ServiceResult<Delicacy>>;
  DeleteDelicacy(DelicacyId: string): Promise<ServiceResult<Delicacy>>;
  GetDelicacyByDelicacyId(DelicacyId: string): Promise<ServiceResult<Delicacy>>;
  GetAllDelicacies(): Promise<ServiceResult<Delicacy>>;
}

export interface IAccommodationService {
  CreateAccommodation(Accommodation: CreateAccommodationDto): Promise<ServiceResult<Accommodation>>;
  UpdateAccommodation(UserId: string, AccommodationId: string, Accommodation: UpdateAccommodationDto): Promise<ServiceResult<Accommodation>>;
  DeleteAccommodation(AccommodationId: string): Promise<ServiceResult<Accommodation>>;
  GetAllAccommodations(): Promise<ServiceResult<Accommodation>>;
  GetUserAccommodations(UserId: string): Promise<ServiceResult<Accommodation>>;
}

export interface IOrderService {
  CreateOrder(Order: CreateOrderDto): Promise<ServiceResult<Order>>;
  UpdateOrder(OrderId: string, Order: UpdateOrderDto): Promise<ServiceResult<Order>>;
  DeleteOrder(OrderId: string): Promise<ServiceResult<Order>>;
  GetUserOrders(UserId: string): Promise<ServiceResult<Order>>;
  GetAllOrders(): Promise<ServiceResult<Order>>;
  GetPaidOrders(): Promise<ServiceResult<Order>>;
  GetUnpaidOrders(): Promise<ServiceResult<Order>>;
  GetDeliveredOrders(): Promise<ServiceResult<Order>>;
  GetUndeliveredOrders(): Promise<ServiceResult<Order>>;
}

export interface IBookingService {
  CreateBooking(UserId: string, BusinessRoomId: string, Booking: CreateBookingDto): Promise<ServiceResult<Booking>>;
  UpdateBooking(UserId: string, BookingId: string, Booking: UpdateBookingDto): Promise<ServiceResult<Booking>>;
  CompleteBookingPayment(UserId: string, BookingId: string): Promise<ServiceResult<Booking>>;
  UpdateBookingStatus(BookingId: string, BookingStatus: string): Promise<ServiceResult<Booking>>;
  DeleteBooking(BookingId: string): Promise<ServiceResult<Booking>>;
  GetAllBookings(): Promise<ServiceResult<Booking>>;
  GetUserBookings(UserId: string): Promise<ServiceResult<Booking>>;
  GetActiveBookings(): Promise<ServiceResult<Booking>>;
  GetInactiveBookings(): Promise<ServiceResult<Booking>>;
  GetPaidBookings(): Promise<ServiceResult<Booking>>;
  GetUnpaidBookings(): Promise<ServiceResult<Booking>>;
}

export interface ICartService {
  CreateCart(Cart: CreateCartDto): Promise<ServiceResult<Cart>>;
  UpdateCart(CartId: string, Cart: UpdateCartDto): Promise<ServiceResult<Cart>>;
  IncrementCartItem(CartId: string): Promise<ServiceResult<Cart>>;
  DecrementCartItem(CartId: string): Promise<ServiceResult<Cart>>;
  DeleteCart(CartId: string): Promise<ServiceResult<Cart>>;
  GetUserCarts(UserId: string): Promise<ServiceResult<Cart>>;
  GetAllCarts(): Promise<ServiceResult<Cart>>;
}

export interface IRecoveryService {
  CreateRecovery(Recovery: CreateRecoveryDto): Promise<ServiceResult<Recovery>>;
  DeleteRecovery(RecoveryId: string): Promise<ServiceResult<Recovery>>;
  GetAllRecoveries(): Promise<ServiceResult<Recovery>>;
}

export interface IPaymentService {
  CreatePayment(Payment: CreatePaymentDto): Promise<ServiceResult<Payment>>;
  GetUserPayments(UserId: string): Promise<ServiceResult<Payment>>;
  GetAllPayments(): Promise<ServiceResult<Payment>>;
  DeletePayment(PaymentId: string): Promise<ServiceResult<Payment>>;
}

export interface IReviewsService {
  CreateReview(Review: CreateReviewDto): Promise<ServiceResult<Review>>;
  UpdateReview(ReviewId: string, Review: CreateReviewDto): Promise<ServiceResult<Review>>;
  DeleteReview(ReviewId: string): Promise<ServiceResult<Review>>;
  GetAllReviews(): Promise<ServiceResult<Review>>;
  GetReviewsByUserId(UserId: string): Promise<ServiceResult<Review>>;
}

export interface INotificationService {
  SendNotification(Notification: CreateNotificationDto): Promise<ServiceResult<Notification>>;
  GetUserNotifications(UserId: string): Promise<ServiceResult<Notification>>;
  DeleteNotification(NotificationId: string): Promise<ServiceResult<Notification>>;
  MarkNotificationAsRead(NotificationId: string): Promise<ServiceResult<Notification>>;
}