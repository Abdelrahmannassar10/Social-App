import { UserRepository } from "../../../DB";
import { ConflictException, NotFoundException } from "../../../utils";
import { VerifyAccountDTO } from "../auth.dto";

export const AuthProvider = {
    async checkOTP(verifyAccountDTO: VerifyAccountDTO) {
            console.log("here");
        const userRepository = new UserRepository;
            console.log("here");

        const user = await userRepository.getOne({ email: verifyAccountDTO.email });
            console.log("here");

        if (!user) throw new NotFoundException("User not found");
        if (user.otp !== verifyAccountDTO.otp) throw new ConflictException("Invalid OTP");
        if (user.otpExpiryAt! < new Date()) throw new ConflictException("OTP expired");

        return user;
    }
};
