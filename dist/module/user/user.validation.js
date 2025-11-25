"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockUserSchema = exports.acceptRequestSchema = exports.addFriendSchema = void 0;
const zod_1 = require("zod");
const middleware_1 = require("../../middleware");
exports.addFriendSchema = zod_1.z.object({
    friendEmail: middleware_1.generalFields.email
});
exports.acceptRequestSchema = zod_1.z.object({
    friendEmail: middleware_1.generalFields.email
});
exports.blockUserSchema = zod_1.z.object({
    userEmail: middleware_1.generalFields.email
});
