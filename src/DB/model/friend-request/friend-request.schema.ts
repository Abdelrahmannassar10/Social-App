import { Schema } from "mongoose";
import { IFriendRequest } from "../../../utils";

export const friendRequestSchema = new Schema<IFriendRequest>({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})