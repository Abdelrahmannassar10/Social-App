import { Server as httpServer } from "http";
import { Server, Socket } from "socket.io";
import { authServer } from "./middleware";
const connectedUsers = new Map<string, string>();
export const initSocket = (server: httpServer) => {
  const io = new Server(server, { cors: { origin: "*" } });
  io.use(authServer);
  io.on("connection", (socket: Socket) => {
    connectedUsers.set(socket.data.user.id, socket.id);
    console.log(connectedUsers);
  });
};
