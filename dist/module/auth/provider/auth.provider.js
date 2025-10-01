"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = void 0;
const DB_1 = require("../../../DB");
const utils_1 = require("../../../utils");
exports.AuthProvider = {
    async checkOTP(verifyAccountDTO) {
        console.log("here");
        const userRepository = new DB_1.UserRepository;
        console.log("here");
        const user = await userRepository.getOne({ email: verifyAccountDTO.email });
        console.log("here");
        if (!user)
            throw new utils_1.NotFoundException("User not found");
        if (user.otp !== verifyAccountDTO.otp)
            throw new utils_1.ConflictException("Invalid OTP");
        if (user.otpExpiryAt < new Date())
            throw new utils_1.ConflictException("OTP expired");
        return user;
    }
};
