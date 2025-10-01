import { Gender, SYS_ROLE, USER_AGENT } from "../../../utils";

export class User {
       firstName:string;
  lastName:string;
       public fullName!: string;
       public email!: string;
       public password!: string;
       public role!: SYS_ROLE;
       public otp!: Number;
       public otpExpiryAt!: Date;
       public isVerified!: boolean;
       public credentialUpdatedAt!: Date;
       public phoneNumber!: string;
       public gender!: Gender;
       public dob!: Date;
       public userAgent!: USER_AGENT;
}