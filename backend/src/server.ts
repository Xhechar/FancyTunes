
import Express, { NextFunction, Request, Response } from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import bodyParser, { json } from 'body-parser';
import { ServiceResponse } from "./interfaces/service.result/service.response";
import { ErrorCode } from "./interfaces/enums/response.enum";
import { Server } from "socket.io";
import http from 'http';
import { setUpSocket } from "./sockets/socket.io";

dotenv.config();

const app = Express();

app.use(bodyParser.json());
app.use(cors({
  origin: ["http://3000"]
}));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res
    .status(501)
    .json(ServiceResponse.failure<undefined>(err.message, ErrorCode.SERVER));
});

const server = http.createServer(app);

export const io: Server = new Server(server, {
  cors: {
    origin: ["http://3000"]
  }
});

setUpSocket(io);

app.listen(3001, () => {
  console.log("Server Is Running On Port 3001");
});