import z from "zod";
import { generalFields } from "../../middleware";
export const createPostSchema = z.object({
    content:generalFields.content,
    mentions:generalFields.mentions
});
export const addReactionSchema =z.object({
    reaction:generalFields.reaction
});
export const updatePostSchema =z.object({
    content:generalFields.content,
    mentions:generalFields.mentions.optional()
});