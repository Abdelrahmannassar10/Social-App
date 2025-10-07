"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const post_service_1 = __importDefault(require("./post.service"));
const __1 = require("..");
const middleware_1 = require("../../middleware");
const comment_validation_1 = require("../comment/comment.validation");
const post_validation_1 = require("./post.validation");
const router = (0, express_1.Router)();
router.use("/:postId/comment", __1.commentRouter);
router.post("/", (0, auth_middleware_1.isAuthenticated)(), (0, middleware_1.isValid)(comment_validation_1.createCommentSchema), post_service_1.default.create);
router.post("/:id", (0, auth_middleware_1.isAuthenticated)(), (0, middleware_1.isValid)(post_validation_1.addReactionSchema), post_service_1.default.addReaction);
router.delete("/:id", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.deletePost);
//public
router.get("/:id", post_service_1.default.getSpecific);
exports.default = router;
