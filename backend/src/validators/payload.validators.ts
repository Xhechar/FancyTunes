import Joi from "joi";

// user validation schema
export const CreateUserSchema = Joi.object({
  FullName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Full Name is required",
    "string.min": "Full Name must be at least 3 characters long",
    "string.max": "Full Name must not exceed 100 characters",
  }),
  Email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
  Phone: Joi.string().min(10).max(15).required().messages({
    "string.empty": "Phone number is required",
    "string.min": "Phone number must be at least 10 digits",
    "string.max": "Phone number must not exceed 15 digits",
  }),
  Password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
  Role: Joi.string().valid("user", "admin").default("user").messages({
    "any.only": 'Role must be either "user" or "admin"',
  }),
  ProfileImage: Joi.string().uri().optional().messages({
    "string.uri": "Profile image must be a valid URL",
  }),
});

export const UpdateUserSchema = Joi.object({
  FullName: Joi.string().min(3).max(100).messages({
    "string.min": "Full Name must be at least 3 characters long",
    "string.max": "Full Name must not exceed 100 characters",
  }),
  Email: Joi.string().email().messages({
    "string.email": "Please provide a valid email address",
  }),
  Phone: Joi.string().min(10).max(15).messages({
    "string.min": "Phone number must be at least 10 digits",
    "string.max": "Phone number must not exceed 15 digits",
  }),
  Role: Joi.string().valid("user", "admin").messages({
    "any.only": 'Role must be either "user" or "admin"',
  }),
  ProfileImage: Joi.string().uri().messages({
    "string.uri": "Profile image must be a valid URL",
  }),
});

// room validation schema
export const CreateRoomSchema = Joi.object({
  RoomCount: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "RoomCount must be a number",
      "number.integer": "RoomCount must be an integer",
      "number.min": "RoomCount must be at least 1",
      "any.required": "RoomCount is required",
    }),
  RoomType: Joi.string()
    .required()
    .messages({ "string.empty": "RoomType is required" }),
  PricePerNight: Joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/)
    .required()
    .messages({
      "string.empty": "PricePerNight is required",
      "string.pattern.base": "PricePerNight must be a valid amount (e.g. 100 or 99.99)",
    }),
  Description: Joi.string()
    .required()
    .messages({ "string.empty": "Description is required" }),
  Capacity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Capacity must be a number",
      "number.integer": "Capacity must be an integer",
      "number.min": "Capacity must be at least 1",
      "any.required": "Capacity is required",
    }),
  Status: Joi.string()
    .valid("Available", "Occupied", "Maintenance", "Reserved")
    .default("Available")
    .messages({
      "any.only": "Status must be one of available, reserved, occupied, or maintenance",
    }),
  RoomImage: Joi.string()
    .uri()
    .optional()
    .messages({ "string.uri": "Room Image must be a valid URL" }),
});

export const UpdateRoomSchema = Joi.object({
  RoomCount: Joi.number()
    .integer()
    .min(1)
    .messages({
      "number.base": "RoomCount must be a number",
      "number.integer": "RoomCount must be an integer",
      "number.min": "RoomCount must be at least 1",
    }),
  RoomType: Joi.string(),
  PricePerNight: Joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/)
    .messages({
      "string.pattern.base": "PricePerNight must be a valid amount (e.g. 100 or 99.99)",
    }),
  Description: Joi.string(),
  Capacity: Joi.number()
    .integer()
    .min(1)
    .messages({
      "number.base": "Capacity must be a number",
      "number.integer": "Capacity must be an integer",
      "number.min": "Capacity must be at least 1",
    }),
  Status: Joi.string().valid("Available", "Occupied", "Maintenance", "Reserved"),
  RoomImage: Joi.string().uri(),
});

// delicacy validation schema
export const CreateDelicacySchema = Joi.object({
  Name: Joi.string()
    .required()
    .messages({ "string.empty": "Delicacy name is required" }),
  Description: Joi.string()
    .required()
    .messages({ "string.empty": "Description is required" }),
  Price: Joi.number()
    .precision(2)
    .required()
    .messages({
      "number.base": "Price must be a valid number",
      "any.required": "Price is required",
    }),
  DelicacyImage: Joi.string()
    .uri()
    .required()
    .messages({
      "string.empty": "Delicacy image URL is required",
      "string.uri": "Image must be a valid URL",
    }),
  Category: Joi.string()
    .required()
    .messages({ "string.empty": "Category is required" }),
  IsAvailable: Joi.boolean().default(true),
});

export const UpdateDelicacySchema = Joi.object({
  Name: Joi.string(),
  Description: Joi.string(),
  Price: Joi.number().precision(2),
  DelicacyImage: Joi.string().uri(),
  Category: Joi.string(),
  IsAvailable: Joi.boolean(),
});

// accommodation validation schema
export const CreateAccommodationSchema = Joi.object({
  UserId: Joi.string()
    .required()
    .messages({ "string.empty": "UserId is required" }),
  RoomId: Joi.string()
    .required()
    .messages({ "string.empty": "RoomId is required" }),
  CheckInDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "Check-In Date must be a valid ISO date",
      "any.required": "Check-In Date is required",
    }),
  CheckOutDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "Check-Out Date must be a valid ISO date",
      "any.required": "Check-Out Date is required",
    }),
  TotalAmount: Joi.number()
    .precision(2)
    .required()
    .messages({ "number.base": "Total Amount must be a valid number" }),
  SpecialRequests: Joi.string().optional(),
  PaymentStatus: Joi.string()
    .valid("unpaid", "paid")
    .default("unpaid")
    .messages({ "any.only": "Payment Status must be either unpaid or paid" }),
  IsActive: Joi.boolean().default(true),
});

export const UpdateAccommodationSchema = Joi.object({
  CheckInDate: Joi.date().iso(),
  CheckOutDate: Joi.date().iso(),
  TotalAmount: Joi.number().precision(2),
  SpecialRequests: Joi.string(),
  PaymentStatus: Joi.string().valid("unpaid", "paid"),
  IsActive: Joi.boolean(),
});

// order validation schema
export const CreateOrderSchema = Joi.object({
  UserId: Joi.string().required(),
  DelicacyId: Joi.string().required(),
  Quantity: Joi.number().integer().min(1).required(),
  TotalAmount: Joi.number().precision(2).required(),
  OrderStatus: Joi.string()
    .valid("pending", "processing", "delivered", "cancelled")
    .default("pending"),
  PaymentStatus: Joi.string().valid("unpaid", "paid").default("unpaid"),
});

export const UpdateOrderSchema = Joi.object({
  Quantity: Joi.number().integer().min(1),
  TotalAmount: Joi.number().precision(2),
  OrderStatus: Joi.string().valid(
    "pending",
    "processing",
    "delivered",
    "cancelled"
  ),
  PaymentStatus: Joi.string().valid("unpaid", "paid"),
  DeliveredAt: Joi.date().iso(),
});

// booking validation schema
export const CreateBookingSchema = Joi.object({
  NumberOfGuests: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "any.required": "Number of guests is required.",
      "number.base": "Number of guests must be a number.",
      "number.integer": "Number of guests must be an integer.",
      "number.min": "Number of guests must be at least 1.",
    }),
  DurationInHours: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "any.required": "Duration in hours is required.",
      "number.base": "Duration in hours must be a number.",
      "number.integer": "Duration in hours must be an integer.",
      "number.min": "Duration in hours must be at least 1.",
    }),
  BookingDate: Joi.date()
    .iso()
    .required()
    .messages({
      "any.required": "Booking date is required.",
      "date.base": "Booking date must be a valid ISO date.",
    }),
  TotalAmount: Joi.number()
    .precision(2)
    .required()
    .messages({
      "any.required": "Total amount is required.",
      "number.base": "Total amount must be a valid number.",
    }),
  SpecialRequests: Joi.string()
    .optional()
    .messages({
      "string.base": "Special requests must be a text value.",
    }),
});

export const UpdateBookingSchema = Joi.object({
  NumberOfGuests: Joi.number()
    .integer()
    .min(1)
    .messages({
      "number.base": "Number of guests must be a number.",
      "number.integer": "Number of guests must be an integer.",
      "number.min": "Number of guests must be at least 1.",
    }),
  DurationInHours: Joi.number()
    .integer()
    .min(1)
    .messages({
      "number.base": "Duration in hours must be a number.",
      "number.integer": "Duration in hours must be an integer.",
      "number.min": "Duration in hours must be at least 1.",
    }),
  BookingDate: Joi.date()
    .iso()
    .messages({
      "date.base": "Booking date must be a valid ISO date.",
    }),
  TotalAmount: Joi.number()
    .precision(2)
    .messages({
      "number.base": "Total amount must be a valid number.",
    }),
  SpecialRequests: Joi.string()
    .messages({
      "string.base": "Special requests must be a text value.",
    }),
});

// review validation schema
export const CreateReviewSchema = Joi.object({
  Rating: Joi.number().integer().min(1).max(5).required(),
  Comment: Joi.string().required(),
});

export const UpdateReviewSchema = Joi.object({
  Rating: Joi.number().integer().min(1).max(5),
  Comment: Joi.string(),
});

// notification validation schema
export const CreateNotificationSchema = Joi.object({
  Title: Joi.string().required(),
  Message: Joi.string().required(),
  IsRead: Joi.boolean().default(false),
});

export const UpdateNotificationSchema = Joi.object({
  Title: Joi.string(),
  Message: Joi.string(),
  IsRead: Joi.boolean(),
});

// order item validation schema
export const CreateOrderItemSchema = Joi.object({
  OrderId: Joi.string().required(),
  DelicacyId: Joi.string().required(),
  Quantity: Joi.number().integer().min(1).required(),
  Price: Joi.number().precision(2).required(),
});

export const UpdateOrderItemSchema = Joi.object({
  Quantity: Joi.number().integer().min(1),
  Price: Joi.number().precision(2),
});

// payment validation schema
export const CreatePaymentSchema = Joi.object({
  UserId: Joi.string().required(),
  Amount: Joi.number().precision(2).required(),
  PaymentMethod: Joi.string().required(),
  PaymentReference: Joi.string().required(),
  TransactionId: Joi.string().required(),
  Status: Joi.string()
    .valid("pending", "completed", "failed")
    .default("pending"),
  BookingId: Joi.string().optional(),
  OrderId: Joi.string().optional(),
  PaidAt: Joi.date().iso().required(),
});

export const UpdatePaymentSchema = Joi.object({
  Amount: Joi.number().precision(2),
  PaymentMethod: Joi.string(),
  PaymentReference: Joi.string(),
  TransactionId: Joi.string(),
  Status: Joi.string().valid("pending", "completed", "failed"),
  PaidAt: Joi.date().iso(),
});

// room image validation schema
export const CreateRoomImageSchema = Joi.object({
  RoomId: Joi.string().required(),
  ImageUrl: Joi.string().uri().required(),
});

export const UpdateRoomImageSchema = Joi.object({
  ImageUrl: Joi.string().uri(),
});

export const createBusinessRoomSchema = Joi.object({
  RoomCount: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "any.required": "RoomCount is required.",
      "number.base": "RoomCount must be a number.",
      "number.integer": "RoomCount must be an integer.",
      "number.min": "RoomCount must be at least 1.",
    }),
  Name: Joi.string()
    .required()
    .messages({
      "any.required": "Name is required.",
      "string.base": "Name must be a text value.",
      "string.empty": "Name cannot be empty.",
    }),
  Description: Joi.string()
    .required()
    .messages({
      "any.required": "Description is required.",
      "string.base": "Description must be a text value.",
      "string.empty": "Description cannot be empty.",
    }),
  Capacity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "any.required": "Capacity is required.",
      "number.base": "Capacity must be a number.",
      "number.integer": "Capacity must be an integer.",
      "number.min": "Capacity must be at least 1.",
    }),
  PricePerHour: Joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/)
    .required()
    .messages({
      "string.empty": "PricePerHour is required.",
      "string.pattern.base": "PricePerHour must be a valid amount (e.g. 100 or 99.99).",
    }),
  Amenities: Joi.string()
    .optional()
    .messages({
      "string.base": "Amenities must be a text value.",
    }),
  BusinessRoomImage: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.base": "BusinessRoomImage must be a text value.",
      "string.uri": "BusinessRoomImage must be a valid URL.",
    }),
  IsAvailable: Joi.boolean()
    .required()
    .messages({
      "any.required": "IsAvailable is required.",
      "boolean.base": "IsAvailable must be true or false.",
    }),
});

export const updateBusinessRoomSchema = Joi.object({
  RoomCount: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      "number.base": "RoomCount must be a number.",
      "number.integer": "RoomCount must be an integer.",
      "number.min": "RoomCount must be at least 1.",
    }),
  Name: Joi.string()
    .optional()
    .messages({
      "string.base": "Name must be a text value.",
      "string.empty": "Name cannot be empty.",
    }),
  Description: Joi.string()
    .optional()
    .messages({
      "string.base": "Description must be a text value.",
      "string.empty": "Description cannot be empty.",
    }),
  Capacity: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      "number.base": "Capacity must be a number.",
      "number.integer": "Capacity must be an integer.",
      "number.min": "Capacity must be at least 1.",
    }),
  PricePerHour: Joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/)
    .optional()
    .messages({
      "string.pattern.base": "PricePerHour must be a valid amount (e.g. 100 or 99.99).",
      "string.base": "PricePerHour must be a text value.",
    }),
  Amenities: Joi.string()
    .optional()
    .messages({
      "string.base": "Amenities must be a text value.",
    }),
  BusinessRoomImage: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.base": "BusinessRoomImage must be a text value.",
      "string.uri": "BusinessRoomImage must be a valid URL.",
    }),
  IsAvailable: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": "IsAvailable must be true or false.",
    }),
});