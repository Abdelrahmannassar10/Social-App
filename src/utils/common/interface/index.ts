import { Gender, SYS_ROLE, USER_AGENT } from "../enum";

export interface IUser {
    lastName: string;
    firstName: string;
    fullName?: string;
    email: string;
    password: string;
    role: SYS_ROLE;
    otp?: string;
    otpExpiryAt?: Date;
    isVerified: boolean;
    credentialUpdatedAt: Date;
    phoneNumber?: string;
    gender :Gender;
    dob?: Date;
    userAgent: USER_AGENT;
}
