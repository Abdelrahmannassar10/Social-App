import { Gender } from "../../utils";
export interface RegisterDTO {
  fullName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  gender?: Gender;
  dob?: Date;
};
export interface VerifyAccountDTO {
  email: string;
  otp: Number;
};
export interface LoginDTO {
  email: string;
  password: string;
};
export interface UpdatePasswordDTO {
  email: string;
  password: string;
};
export interface UpdateInfoDTO {
  fullName?: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  gender?: Gender;
  dob?: Date;
};
export interface UpdateEmailDTO {
  email: string;
  newEmail: string;
};
