import { Socket } from "socket.io";
import { verifyToken } from "../../utils/token";
import { UserRepository } from "../../DB";
import { NotFoundException } from "../../utils";

export const authServer = async (socket: Socket,next:Function) => {
  try {
    const { authorization } = socket.handshake.auth;
    const payload = verifyToken(authorization);
    const userRepository = new UserRepository();
    const user = await userRepository.getOne({ _id: payload._id });
    if (!user) {
      throw new NotFoundException("user not founded");
    };
    socket.data.user =user;
    next();
  } catch (error) {
    next(error)
  }
};
