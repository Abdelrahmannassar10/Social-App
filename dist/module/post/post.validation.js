"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostSchema = exports.addReactionSchema = exports.createPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const middleware_1 = require("../../middleware");
exports.createPostSchema = zod_1.default.object({
    content: middleware_1.generalFields.content,
    mentions: middleware_1.generalFields.mentions
});
exports.addReactionSchema = zod_1.default.object({
    reaction: middleware_1.generalFields.reaction
});
exports.updatePostSchema = zod_1.default.object({
    content: middleware_1.generalFields.content,
    mentions: middleware_1.generalFields.mentions.optional()
});
