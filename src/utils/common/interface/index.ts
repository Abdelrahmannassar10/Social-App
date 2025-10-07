import { Gender, REACTION, SYS_ROLE, USER_AGENT } from "../enum";
import { ObjectId } from "mongoose";
export interface IAttachment{
    url:string;
    id:string
}
export interface IUser {
    lastName: string;
    firstName: string;
    fullName?: string;
    email: string;
    password: string;
    role: SYS_ROLE;
    otp?: Number;
    otpExpiryAt?: Date;
    isVerified: boolean;
    credentialUpdatedAt: Date;
    phoneNumber?: string;
    gender :Gender;
    dob?: Date;
    userAgent: USER_AGENT;
    _id:ObjectId;
    isTwoStepEnable?:boolean;
}
export interface IReaction{
    reaction:REACTION,
    userId:ObjectId
}
export interface IPost{
    _id:ObjectId;
    userId:ObjectId;
    content:string;
    attachments ?:IAttachment[];
    reactions:IReaction[];
    mentions:string[];
}
export interface IComment{
    _id:ObjectId;
    userId:ObjectId;
    postId:ObjectId;
    parentId:ObjectId;
    content:string;
    reactions:IReaction[]
    attachment:IAttachment;
    mention:ObjectId[];
}
declare module "jsonwebtoken"{
interface JwtPayload{
    _id:string;
    role:string;
}
}
declare module "express"{
    interface Request{
        user?:IUser&Document;
    }
}
