import { NextFunction, Request, Response } from "express";
import { RegisterDTO } from "./auth.dto";
import { ConflictException, NotFoundException } from "../../utils/error";
import { UserRepository } from "../../DB/user/user.repository";
import { AuthFactoryService } from "./factory";
import { compareHash } from "../../utils/hash";

class AuthService {
    private userRepository = new UserRepository()
    private authFactoryService = new AuthFactoryService();
    constructor() { };
    async register(req: Request, res: Response, next: NextFunction) {
        const registerDTO: RegisterDTO = req.body;
        const userExist = await this.userRepository.getOne({ email: registerDTO.email });
        if (userExist) {
            throw new ConflictException("User already exist");
        }
        const user = this.authFactoryService.register(registerDTO);
        const createdUser = await this.userRepository.create(user);
        return res.status(201).json({ message: "User created successfully", success: true, data: createdUser })
    };
    async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        const user = await this.userRepository.getOne({ email });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const isPasswordValid = compareHash(password, user.password);
        if (!isPasswordValid) {
            throw new ConflictException("Invalid credentials");
        }
        if (!user.isVerified) {
            throw new ConflictException("User not verified");
        }
        return res.status(200).json({ message: "Login successful", success: true })
    }
    async verifyOTP(req: Request, res: Response, next: NextFunction) {
        const { email, otp } = req.body;
        const user = await this.userRepository.getOne({ email });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        if (user.otp !== otp) {
            throw new ConflictException("Invalid OTP");
        }
        if (user.otpExpiryAt! < new Date()) {
            throw new ConflictException("OTP expired");
        }
        user.isVerified = true;
        await this.userRepository.update(email ,user);
        return res.status(200).json({ message: "OTP verified successfully", success: true });
    }
}
export default new AuthService();