
import {Server, Socket} from 'socket.io';

const UserSocket = new Map<string, string>();

export const setUpSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Socket Connected With CLIENT_ID: ${socket.id}`);

    socket.on("register", ({ UserId }) => {
      UserSocket.set(UserId, socket.id);
    });

    socket.on("disconnect", () => {
      console.log(`Client Disconected With CLIENT_ID: ${socket.id}`);
    });
  });
}

export const EmitToSingleUser = (io: Server, UserId: string, EventName: string, EventData: any) => {
  const SocketId = UserSocket.get(UserId);

  if(SocketId) {
    io.to(SocketId).emit(EventName, EventData);
  }
}