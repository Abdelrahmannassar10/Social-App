import { Schema } from "mongoose";
import { IToken, TOKEN_TYPE } from "../../../utils";

export const tokenSchema =new  Schema<IToken>({
    token:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    type:{
        type:Number,
        enum:TOKEN_TYPE,
        default:TOKEN_TYPE.access
    }
},{timestamps:true})