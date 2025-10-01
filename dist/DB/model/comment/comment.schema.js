"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
exports.commentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    parentIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment",
            required: true,
        },
    ],
    content: {
        type: String,
    },
    reactions: [common_1.reactionSchema]
}, { timestamps: true });
