
import { io, Socket } from "socket.io-client";

const SocketURL: string = "https://api-fancy-tunes.onrender.com";

export const socket: Socket = io(SocketURL, {
  withCredentials: true,
  transports: ["websocket"]
});