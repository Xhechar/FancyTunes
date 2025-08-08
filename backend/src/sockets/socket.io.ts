
import {Server, Socket} from 'socket.io';

export const setUpSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Socket Connected With CLIENT_ID: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client Disconected With CLIENT_ID: ${socket.id}`);
    });
  });
}