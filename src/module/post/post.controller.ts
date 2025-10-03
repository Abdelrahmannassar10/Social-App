import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import postService from "./post.service";
import { commentRouter } from "..";
const router = Router();
router.use("/:postId/comment",commentRouter);
router.post("/", isAuthenticated(), postService.create);
router.post("/:id", isAuthenticated(), postService.addReaction);
router.delete("/:id",isAuthenticated(),postService.deletePost);
//public
router.get("/:id",postService.getSpecific);
export default router;
