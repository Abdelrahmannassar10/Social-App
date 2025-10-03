import { z } from "zod";
import { generalFields } from "../../middleware";
export const createCommentSchema =z.object({
    content:generalFields.content
});
export const addReactionSchema =z.object({
    reaction:generalFields.reaction
});
export type CreateCommentDTO = z.infer<typeof createCommentSchema>;
export type AddReactionDTO = z.infer<typeof addReactionSchema>;
