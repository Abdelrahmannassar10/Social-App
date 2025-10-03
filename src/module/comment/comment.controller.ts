import { Router } from "express";
import { isAuthenticated } from "../../middleware/";
import commentService from "./comment.service";
const router =Router({mergeParams:true});
router.post("{/:id}",isAuthenticated(),commentService.createComment);
router.get("/:id",isAuthenticated(),commentService.getSpecific);
router.delete("/:id",isAuthenticated(),commentService.deleteComment);
router.patch("/:id",isAuthenticated(),commentService.addReaction);
export default router ;