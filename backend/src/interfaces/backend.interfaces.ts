export interface User {
  UserId: string;
  FullName: string;
  Email: string;
  Phone: string;
  Password: string;
  Role: string;
  ProfileImage?: string;
  IsWelcome: boolean;
  CreatedAt: string;
  UpdatedAt: string;

  Bookings: Booking[];
  Accommodations: Accommodation[];
  Orders: Order[];
  Carts: Cart[];
  Recoveries: Recovery[];
  Payments: Payment[];
  Reviews: Review[];
  Notifications: Notification[];
}

export interface Room {
  RoomId: string;
  RoomNumber: string;
  RoomType: string;
  PricePerNight: number;
  Description: string;
  Capacity: number;
  Status: string;
  RoomImage?: string;
  CreatedAt: string;
  UpdatedAt: string;

  Accommodations: Accommodation[];
  Bookings: Booking[];
  Reviews: Review[];
  RoomImages: RoomImage[];
}

export interface Delicacy {
  DelicacyId: string;
  Name: string;
  Description: string;
  Price: number;
  DelicacyImage: string;
  Category: string;
  IsAvailable: boolean;
  CreatedAt: string;
  UpdatedAt: string;

  Orders: Order[];
  Carts: Cart[];
  OrderItems: OrderItem[];
  Reviews: Review[];
}

export interface Accommodation {
  AccommodationId: string;
  UserId: string;
  RoomId: string;
  CheckInDate: string;
  CheckOutDate: string;
  TotalAmount: number;
  SpecialRequests?: string;
  PaymentStatus: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;

  User: User;
  Room: Room;
}

export interface Order {
  OrderId: string;
  UserId: string;
  DelicacyId: string;
  Quantity: number;
  TotalAmount: number;
  OrderStatus: string;
  OrderedAt: string;
  DeliveredAt?: string;
  PaymentStatus: string;

  User: User;
  Delicacy: Delicacy;
  OrderItems: OrderItem[];
}

export interface Booking {
  BookingId: string;
  UserId: string;
  RoomId: string;
  CheckInDate: string;
  CheckOutDate: string;
  NumberOfGuests: number;
  TotalAmount: number;
  SpecialRequests?: string;
  BookingStatus: string;
  PaymentStatus: string;
  CreatedAt: string;
  UpdatedAt: string;

  User: User;
  Room: Room;
}

export interface Cart {
  CartId: string;
  UserId: string;
  DelicacyId: string;
  Quantity: number;
  AddedAt: string;

  User: User;
  Delicacy: Delicacy;
}

export interface Recovery {
  RecoveryId: string;
  UserId: string;
  VerificationCode: number;
  ExpiresAt: string;
  IsUsed: boolean;
  CreatedAt: string;

  User: User;
}

export interface Payment {
  PaymentId: string;
  UserId: string;
  Amount: number;
  PaymentMethod: string;
  PaymentReference: string;
  TransactionId: string;
  Status: string;
  BookingId?: string;
  OrderId?: string;
  PaidAt: string;
  CreatedAt: string;

  User: User;
}

export interface OrderItem {
  OrderItemId: string;
  OrderId: string;
  DelicacyId: string;
  Quantity: number;
  Price: number;
  Subtotal: number;

  Order: Order;
  Delicacy: Delicacy;
}

export interface Review {
  ReviewId: string;
  UserId: string;
  RoomId?: string;
  DelicacyId?: string;
  Rating: number;
  Comment: string;
  CreatedAt: string;

  User: User;
  Room?: Room;
  Delicacy?: Delicacy;
}

export interface Notification {
  NotificationId: string;
  UserId: string;
  Title: string;
  Message: string;
  IsRead: boolean;
  CreatedAt: string;

  User: User;
}

export interface RoomImage {
  RoomImageId: string;
  RoomId: string;
  ImageUrl: string;

  Room: Room;
}