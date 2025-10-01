"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFactoryService = void 0;
const utils_1 = require("../../../utils");
const utils_2 = require("../../../utils");
const utils_3 = require("../../../utils");
const entity_1 = require("../entity");
class AuthFactoryService {
    async register(registerDTO) {
        const user = new entity_1.User();
        const [firstName, lastName] = registerDTO.fullName.split(" ");
        user.firstName = firstName;
        user.lastName = lastName;
        user.fullName = registerDTO.fullName;
        user.email = registerDTO.email;
        user.password = await (0, utils_2.generateHash)(registerDTO.password);
        user.role = utils_1.SYS_ROLE.USER;
        user.isVerified = false;
        user.credentialUpdatedAt = new Date();
        user.phoneNumber = registerDTO.phoneNumber;
        user.gender = registerDTO.gender;
        user.dob = registerDTO.dob;
        user.userAgent = utils_1.USER_AGENT.local;
        user.otp = Number((0, utils_3.generateOTP)());
        user.otpExpiryAt = (0, utils_3.generateOTPExpiry)(10);
        return user;
    }
}
exports.AuthFactoryService = AuthFactoryService;
