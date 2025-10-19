import Express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bodyParser, { json } from "body-parser";
import { ServiceResponse } from "./interfaces/service.result/service.response";
import { ErrorCode } from "./interfaces/enum/response.enum";
import { Server } from "socket.io";
import http from "http";
import { setUpSocket } from "./sockets/socket.io";
import { AccommodationRouter } from "./routes/accommodations.routes";
import { AuthRouter } from "./routes/auth.routes";
import { BookingRouter } from "./routes/bookings.routes";
import { CartRouter } from "./routes/cart.routes";
import { DelicacyRouter } from "./routes/delicacies.routes";
import { NotificationRouter } from "./routes/notifications.routes";
import { OrderRouter } from "./routes/order.routes";
import { PaymentRouter } from "./routes/payments.routes";
import { ReviewsRouter } from "./routes/reviews.routes";
import { RoomRouter } from "./routes/rooms.routes";
import { UserRouter } from "./routes/user.routes";
import { BusinessRoomRouter } from "./routes/business.room.routes";
import winston from "./logs/logger";
import morgan from 'morgan';

dotenv.config();

const app = Express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/accommodation", AccommodationRouter);
app.use("/auth", AuthRouter);
app.use("/booking", BookingRouter);
app.use("/business-room", BusinessRoomRouter);
app.use("/cart", CartRouter);
app.use("/delicacy", DelicacyRouter);
app.use("/notification", NotificationRouter);
app.use("/order", OrderRouter);
app.use("/payment", PaymentRouter);
app.use("/review", ReviewsRouter);
app.use("/room", RoomRouter);
app.use("/user", UserRouter);

app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => winston.info(message.trim()),
    },
  })
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res
    .status(501)
    .json(ServiceResponse.failure<object>(ErrorCode.SERVER, err.message));
});

const server = http.createServer(app);

export const io: Server = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  },
});

setUpSocket(io);

server.listen(3001, () => {
  winston.info("Server and Socket.IO are running on port 3001.");
});