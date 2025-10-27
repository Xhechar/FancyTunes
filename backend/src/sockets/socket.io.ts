import {Server, Socket} from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

const UserSocket = new Map<string, string>();

export const setUpSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        socket.disconnect();
        return;
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.auth_token;

      if (!token) {
        socket.disconnect();
        return;
      }

      let rawToken = token.startsWith("s:") ? token.slice(2) : token;

      if (rawToken.includes(".")) {
        const parts = rawToken.split(".");
        if (parts.length > 3) {
          rawToken = parts.slice(0, 3).join(".");
        }
      };
      const decoded: any = jwt.verify(rawToken, process.env.SECRET_KEY as string);

      const userId = decoded.UserId;

      UserSocket.set(userId, socket.id);

    } catch (error: any) {
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