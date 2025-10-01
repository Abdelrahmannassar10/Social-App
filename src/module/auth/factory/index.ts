import { Gender, SYS_ROLE, USER_AGENT } from "../../../utils";
import { generateHash } from "../../../utils";
import { generateOTP, generateOTPExpiry } from "../../../utils";
import { RegisterDTO } from "../auth.dto";
import { User } from "../entity";

export class AuthFactoryService {
   async register (registerDTO: RegisterDTO) {
        const user = new User();
        const [firstName, lastName] = registerDTO.fullName.split(" ");
        user.firstName=firstName;
        user.lastName=lastName;
        user.fullName = registerDTO.fullName as string;
        user.email = registerDTO.email;
        user.password = await generateHash(registerDTO.password as string);
        user.role = SYS_ROLE.USER;
        user.isVerified = false;
        user.credentialUpdatedAt = new Date();
        user.phoneNumber = registerDTO.phoneNumber as string;
        user.gender = registerDTO.gender as Gender;
        user.dob = registerDTO.dob as Date;
        user.userAgent =  USER_AGENT.local;
        user.otp = Number(generateOTP());
        user.otpExpiryAt = generateOTPExpiry(10); 

        return user;
    }
}
