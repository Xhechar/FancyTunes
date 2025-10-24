import {Server, Socket} from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

const UserSocket = new Map<string, string>();

export const setUpSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    try {
      console.log(socket.handshake.headers.cookie);
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        console.log("No cookies found");
        socket.disconnect();
        return;
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.auth_token;

      if (!token) {
        console.log("No token cookie found");
        socket.disconnect();
        return;
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = decoded.UserId;

      UserSocket.set(userId, socket.id);
      console.log(`✅ Socket Registered for User: ${userId}`);

    } catch (error: any) {
      console.log("Socket Authentication Error:", error.message);
      socket.disconnect();
    }
  });
}

export const EmitToSingleUser = (io: Server, UserId: string, EventName: string, EventData: any) => {
  const SocketId = UserSocket.get(UserId);

  if(SocketId) {
    io.to(SocketId).emit(EventName, EventData);
  }
}