import { Gender, REACTION, SYS_ROLE, TOKEN_TYPE, USER_AGENT } from "../enum";
import { ObjectId } from "mongoose";
export interface IAttachment{
    url:string;
    id:string
}
export interface IUser {
    id:string
    lastName: string;
    firstName: string;
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
    tempEmail:string;
    oldEmailOTP:Number;
    newEmailOTP:Number;
    friends:ObjectId[];
    blockedUsers:ObjectId[];
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
    deletedAt:Date;
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
    deletedAt:Date
}
declare module "jsonwebtoken"{
interface JwtPayload{
    _id:string;
    role:string;
}
}
declare module "express"{
    interface Request{
        user?:IUser;
    }
}
export interface IToken{
    token:string;
    userId:ObjectId;
    type:TOKEN_TYPE
}
export interface IFriendRequest{
    sender:ObjectId;
    receiver:ObjectId;
}