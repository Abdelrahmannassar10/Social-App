import { json, NextFunction, Request, Response } from "express";
import { RegisterDTO, VerifyAccountDTO } from "./auth.dto";
import { BadRequestException, ConflictException, NotFoundException } from "../../utils";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { compareHash } from "../../utils";
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
        const user = await this.authFactoryService.register(registerDTO);
        const createdUser = await this.userRepository.create(user);
        return res.status(201).json({ message: "User created successfully", success: true, data: { id: createdUser.id } })
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
    async verifyAccount(req: Request, res: Response, next: NextFunction) {
        const verifyAccountDTO: VerifyAccountDTO = req.body;
        await this.userRepository.update({ email: verifyAccountDTO.email }, {isVerified:true,$unset:{otp:"",otpExpiryAt:""}});
        return res.sendStatus(204);
    }
}
export default new AuthService();