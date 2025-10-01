import { json, NextFunction, Request, Response } from "express";
import { LoginDTO, RegisterDTO, VerifyAccountDTO } from "./auth.dto";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "../../utils";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { compareHash } from "../../utils";
import { generateToken } from "../../utils/token";
import { AuthProvider } from "./provider/auth.provider";
import bcrypt from "bcryptjs";

class AuthService {
  private userRepository = new UserRepository();
  private authFactoryService = new AuthFactoryService();
  constructor() {}
  register = async (req: Request, res: Response) => {
    const registerDTO: RegisterDTO = req.body;

    console.log("here");

    const userExist = await this.userRepository.getOne({
      email: registerDTO.email,
    });
    console.log("here");

    if (userExist) {
      throw new ConflictException("User already exist");
    }
    const user = await this.authFactoryService.register(registerDTO);
    console.log("here");
    console.log(user);

    const createdUser = await this.userRepository.create(user);
    return res.status(201).json({
      message: "User created successfully",
      success: true,
      data: { id: createdUser.id },
    });
  };
  login = async (req: Request, res: Response) => {
    const loginDTO: LoginDTO = req.body;
    const userExist = await this.userRepository.exist({
      email: loginDTO.email,
    });
    if (!userExist) {
      throw new ForbiddenException("invalid credentials");
    };   
    if (!(await compareHash(loginDTO.password, userExist.password))) {
      throw new ForbiddenException("invalid credentials");
    };
    console.log(userExist.isVerified);
    
    if(userExist.isVerified==false){
      throw new ForbiddenException("user isn`t verified");
    }
    const accessToken = generateToken({
      payload: { _id: userExist._id, role: userExist.role },
      options: { expiresIn: "1d" },
    });
    res.status(200).json({
      message: "login successfully",
      success: true,
      data: { accessToken },
    });
  };
  verifyAccount = async (req: Request, res: Response) => {
    const verifyAccountDTO: VerifyAccountDTO = req.body;
    console.log("here");

    // console.log(verifyAccountDTO);
    const user = await AuthProvider.checkOTP(verifyAccountDTO);
    console.log("here");

    await this.userRepository.update(
      { email: verifyAccountDTO.email },
      { isVerified: true, $unset: { otp: "", otpExpiryAt: "" } }
    );
    console.log("here");

    return res.sendStatus(204);
  };
}
export default new AuthService();
