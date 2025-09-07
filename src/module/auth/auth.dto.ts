import { Gender } from "../../utils/common/enum";

export interface RegisterDTO {
    fullName?: string;
    email: string;
    password: string;
    phoneNumber?: string;
    gender?: Gender;
    dob?: Date;
};
