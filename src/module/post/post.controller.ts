import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import postService from "./post.service";
import { commentRouter } from "..";
import { isValid } from "../../middleware";
import { createCommentSchema } from "../comment/comment.validation";
import { addReactionSchema } from "./post.validation";
const router = Router();
router.use("/:postId/comment",commentRouter);
router.post("/", isAuthenticated(),isValid(createCommentSchema), postService.create);
router.post("/:id", isAuthenticated(),isValid(addReactionSchema), postService.addReaction);
router.delete("/:id",isAuthenticated(),postService.deletePost);
//public
router.get("/:id",postService.getSpecific);
export default router;
