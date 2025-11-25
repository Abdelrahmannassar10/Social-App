"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware/");
const comment_service_1 = __importDefault(require("./comment.service"));
const comment_validation_1 = require("./comment.validation");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("{/:id}", (0, middleware_1.isAuthenticated)(), (0, middleware_1.isValid)(comment_validation_1.createCommentSchema), comment_service_1.default.createComment);
router.get("/:id", (0, middleware_1.isAuthenticated)(), comment_service_1.default.getSpecific);
router.delete("/:id", (0, middleware_1.isAuthenticated)(), comment_service_1.default.deleteComment);
router.patch("/:id", (0, middleware_1.isAuthenticated)(), (0, middleware_1.isValid)(comment_validation_1.addReactionSchema), comment_service_1.default.addReaction);
router.patch("/freezePost/:id", (0, middleware_1.isAuthenticated)(), comment_service_1.default.freezeComment);
router.patch("/unfreezePost/:id", (0, middleware_1.isAuthenticated)(), comment_service_1.default.unfreezePost);
router.put("/:id", (0, middleware_1.isAuthenticated)(), (0, middleware_1.isValid)(comment_validation_1.updateCommentSchema), comment_service_1.default.updateComment);
exports.default = router;
