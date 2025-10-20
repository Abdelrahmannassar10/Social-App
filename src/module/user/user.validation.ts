import { z } from "zod";
import { generalFields } from "../../middleware";
export const addFriendSchema =z.object({
    friendEmail:generalFields.email
});
export const acceptRequestSchema =z.object({
    friendEmail:generalFields.email
});
export const blockUserSchema =z.object({
    userEmail:generalFields.email
});