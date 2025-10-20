import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import postService from "./post.service";
import { commentRouter } from "..";
import { isValid } from "../../middleware";
import { createCommentSchema, updateCommentSchema } from "../comment/comment.validation";
import { addReactionSchema } from "./post.validation";
const router = Router();
router.use("/:postId/comment",commentRouter);
router.post("/", isAuthenticated(),isValid(createCommentSchema), postService.create);
router.post("/:id", isAuthenticated(),isValid(addReactionSchema), postService.addReaction);
router.delete("/:id",isAuthenticated(),postService.deletePost);
router.put("/freezePost/:id",isAuthenticated(),postService.freezePost);
router.put("/unfreezePost/:id",isAuthenticated(),postService.unfreezePost);
router.put("/:id",isAuthenticated(),isValid(updateCommentSchema),postService.updatePost);
//public
router.get("/:id",postService.getSpecific);
export default router;
