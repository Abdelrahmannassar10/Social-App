import { UserRepository } from "../../../DB";
import { ConflictException, NotFoundException } from "../../../utils";
import { VerifyAccountDTO } from "../auth.dto";

export const AuthProvider = {
    async checkOTP(verifyAccountDTO: VerifyAccountDTO) {
        const userRepository = new UserRepository
        const user = await userRepository.getOne({ email: verifyAccountDTO.email });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        if (user.otp !== verifyAccountDTO.otp) {
            throw new ConflictException("Invalid OTP");
        }
        if (user.otpExpiryAt! < new Date()) {
            throw new ConflictException("OTP expired");
        }
    }
}