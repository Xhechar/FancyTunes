
import { io, Socket } from "socket.io-client";

const SocketURL: string = "http://localhost:3001";

export const socket: Socket = io(SocketURL, {
  withCredentials: true,
  transports: ["websocket"]
});