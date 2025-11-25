"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentSchema = exports.addReactionSchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
const middleware_1 = require("../../middleware");
exports.createCommentSchema = zod_1.z.object({
    content: middleware_1.generalFields.content
});
exports.addReactionSchema = zod_1.z.object({
    reaction: middleware_1.generalFields.reaction
});
exports.updateCommentSchema = zod_1.z.object({
    content: middleware_1.generalFields.content
});
