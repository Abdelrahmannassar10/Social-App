import { model } from "mongoose";
import { friendRequestSchema } from "./friend-request.schema";

export const FriendRequest =model("FriendRequest",friendRequestSchema)