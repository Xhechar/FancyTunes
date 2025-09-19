import { Router } from "express";
import { verifyToken, verifyAdmin, verifyUser } from "../middlewares/backend.middleware";
import { BookingController } from "../controllers/bookings.controller";

export const BookingRouter = Router();

const bookingController: BookingController = new BookingController();

BookingRouter.put(
  "/update-booking/:BookingId",
  verifyToken,
  verifyUser,
  async (Req, Res) => await bookingController.UpdateBooking(Req, Res)
);

BookingRouter.patch(
  "/update-booking-status/:BookingId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await bookingController.UpdateBookingStatus(Req, Res)
);

BookingRouter.delete(
  "/delete-booking/:BookingId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await bookingController.DeleteBooking(Req, Res)
);

BookingRouter.get(
  "/get-all-bookings",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await bookingController.GetAllBookings(Req, Res)
);

BookingRouter.get(
  "/get-user-bookings",
  verifyToken,
  verifyUser,
  async (Req, Res) => await bookingController.GetUserBookings(Req, Res)
);

BookingRouter.get(
  "/get-active-bookings",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await bookingController.GetActiveBookings(Req, Res)
);

BookingRouter.get(
  "/get-inactive-bookings",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await bookingController.GetInactiveBookings(Req, Res)
);

BookingRouter.get(
  "/get-paid-bookings",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await bookingController.GetPaidBookings(Req, Res)
);

BookingRouter.get(
  "/get-unpaid-bookings",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await bookingController.GetUnpaidBookings(Req, Res)
);
