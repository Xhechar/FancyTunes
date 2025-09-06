export interface CreateUserDto {
  FullName: string;
  Email: string;
  Phone: string;
  Password: string;
  Role: string;
  ProfileImage?: string;
}

export interface UpdateUserDto {
  FullName?: string;
  Email?: string;
  Phone?: string;
  ProfileImage?: string;
}

export interface CreateRoomDto {
  RoomNumber: string;
  RoomType: string;
  PricePerNight: string;
  Description: string;
  Capacity: number;
  Status: string;
  RoomImage?: string;
}

export interface UpdateRoomDto {
  RoomNumber?: string;
  RoomType?: string;
  PricePerNight?: string;
  Description?: string;
  Capacity?: number;
  Status?: string;
  RoomImage?: string;
}

export interface CreateBusinessRoomDto {
  RoomNumber: string;
  Name: string;
  Description: string;
  Capacity: number;
  PricePerHour: string;
  Amenities?: string;
  BusinessRoomImage?: string;
}

export interface CreateDelicacyDto {
  Name: string;
  Description: string;
  Price: string;
  DelicacyImage: string;
  Category: string;
  IsAvailable: boolean;
}

export interface UpdateDelicacyDto {
  Name?: string;
  Description?: string;
  Price?: string;
  DelicacyImage?: string;
  Category?: string;
  IsAvailable?: boolean;
}

export interface CreateAccommodationDto {
  UserId: string;
  RoomId: string;
  CheckInDate: Date;
  CheckOutDate: Date;
  SpecialRequests?: string;
}

export interface UpdateAccommodationDto {
  CheckInDate?: Date;
  CheckOutDate?: Date;
  SpecialRequests?: string;
}

export interface CreateOrderDto {
  UserId: string;
  DelicacyId: string;
  Quantity: number;
  TotalAmount: string;
  OrderStatus: string;
  PaymentStatus: string;
}

export interface UpdateOrderDto {
  Quantity?: number;
  TotalAmount?: string;
  OrderStatus?: string;
  PaymentStatus?: string;
  DeliveredAt?: Date;
}

export interface CreateBookingDto {
  UserId: string;
  RoomId: string;
  CheckInDate: Date;
  CheckOutDate: Date;
  NumberOfGuests: number;
  PaymentStatus: string;
  TotalAmount: string;
  SpecialRequests?: string;
  BookingStatus: string;
}

export interface UpdateBookingDto {
  CheckInDate?: Date;
  CheckOutDate?: Date;
  NumberOfGuests?: number;
  PaymentStatus?: string;
  TotalAmount?: string;
  SpecialRequests?: string;
  BookingStatus?: string;
}

export interface CreateCartDto {
  UserId: string;
  DelicacyId: string;
  Quantity: number;
  TotalAmount: string;
}

export interface UpdateCartDto {
  Quantity?: number;
  TotalAmount?: string;
}

export interface CreateRecoveryDto {
  UserId: string;
  Code: string;
  ExpiresAt: string;
}

export interface CreateReviewDto {
  UserId: string;
  RoomId?: string;
  DelicacyId?: string;
  Rating: number;
  Comment: string;
}

export interface UpdateReviewDto {
  Rating?: number;
  Comment?: string;
}

export interface CreateNotificationDto {
  UserId: string;
  Title: string;
  Message: string;
  IsRead: boolean;
}

export interface UpdateNotificationDto {
  Title?: string;
  Message?: string;
  IsRead?: boolean;
}

export interface CreateOrderItemDto {
  OrderId: string;
  DelicacyId: string;
  Quantity: number;
  Price: string;
}

export interface UpdateOrderItemDto {
  Quantity?: number;
  Price?: string;
}

export interface CreatePaymentDto {
  UserId: string;
  Amount: string;
  PaymentMethod: string;
  PaymentStatus: string;
  Reference: string;
  PaidAt: string;
}

export interface CreateRoomImageDto {
  RoomId: string;
  ImageUrl: string;
}

export interface UpdateRoomImageDto {
  ImageUrl?: string;
}