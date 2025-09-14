import { Gender } from "../../utils";

export interface RegisterDTO {
    fullName?: string;
    email: string;
    password: string;
    phoneNumber?: string;
    gender?: Gender;
    dob?: Date;
};
