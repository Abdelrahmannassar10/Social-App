"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServer = void 0;
const token_1 = require("../../utils/token");
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
const authServer = async (socket, next) => {
    try {
        const { authorization } = socket.handshake.auth;
        const payload = (0, token_1.verifyToken)(authorization);
        const userRepository = new DB_1.UserRepository();
        const user = await userRepository.getOne({ _id: payload._id });
        if (!user) {
            throw new utils_1.NotFoundException("user not founded");
        }
        ;
        socket.data.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authServer = authServer;
