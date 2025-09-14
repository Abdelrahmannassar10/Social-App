"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
const utils_2 = require("../../utils");
class AuthService {
    userRepository = new DB_1.UserRepository();
    authFactoryService = new factory_1.AuthFactoryService();
    constructor() { }
    ;
    async register(req, res, next) {
        const registerDTO = req.body;
        const userExist = await this.userRepository.getOne({ email: registerDTO.email });
        if (userExist) {
            throw new utils_1.ConflictException("User already exist");
        }
        const user = await this.authFactoryService.register(registerDTO);
        const createdUser = await this.userRepository.create(user);
        return res.status(201).json({ message: "User created successfully", success: true, data: createdUser });
    }
    ;
    async login(req, res, next) {
        const { email, password } = req.body;
        const user = await this.userRepository.getOne({ email });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        const isPasswordValid = (0, utils_2.compareHash)(password, user.password);
        if (!isPasswordValid) {
            throw new utils_1.ConflictException("Invalid credentials");
        }
        if (!user.isVerified) {
            throw new utils_1.ConflictException("User not verified");
        }
        return res.status(200).json({ message: "Login successful", success: true });
    }
    async verifyOTP(req, res, next) {
        const { email, otp } = req.body;
        const user = await this.userRepository.getOne({ email });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (user.otp !== otp) {
            throw new utils_1.ConflictException("Invalid OTP");
        }
        if (user.otpExpiryAt < new Date()) {
            throw new utils_1.ConflictException("OTP expired");
        }
        user.isVerified = true;
        await this.userRepository.update(email, user);
        return res.status(200).json({ message: "OTP verified successfully", success: true });
    }
}
exports.default = new AuthService();
