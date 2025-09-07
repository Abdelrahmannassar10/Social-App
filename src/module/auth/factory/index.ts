import { Gender, SYS_ROLE, USER_AGENT } from "../../../utils/common/enum";
import { generateHash } from "../../../utils/hash";
import { generateOTP, generateOTPExpiry } from "../../../utils/otp";
import { RegisterDTO } from "../auth.dto";
import { User } from "../entity";

export class AuthFactoryService {
    register(registerDTO: RegisterDTO) {
        const user = new User();
        user.fullName = registerDTO.fullName as string;
        user.email = registerDTO.email;
        user.password = registerDTO.password;
        user.role = SYS_ROLE.USER;
        user.isVerified = false;
        user.credentialUpdatedAt = new Date();
        user.phoneNumber = generateHash(registerDTO.phoneNumber as string);
        user.gender = registerDTO.gender as Gender;
        user.dob = registerDTO.dob as Date;
        user.userAgent =  USER_AGENT.local;
        user.otp = generateOTP();
        user.otpExpiryAt = generateOTPExpiry(10); 

        return user;
    }
}
