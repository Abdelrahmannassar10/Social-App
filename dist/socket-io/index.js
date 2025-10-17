"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const middleware_1 = require("./middleware");
const connectedUsers = new Map();
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    io.use(middleware_1.authServer);
    io.on("connection", (socket) => {
        connectedUsers.set(socket.data.user.id, socket.id);
        console.log(connectedUsers);
    });
};
exports.initSocket = initSocket;
