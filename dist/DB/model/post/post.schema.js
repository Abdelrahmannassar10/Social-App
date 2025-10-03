"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const comment_model_1 = require("../comment/comment.model");
exports.postSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    content: {
        type: String,
        //   required: function(){
        //     if(this.attachments?.length){
        //         return false
        //     }
        //     return true
        //   },
        trim: true,
    },
    reactions: [common_1.reactionSchema],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.postSchema.virtual("comment", {
    localField: "_id",
    foreignField: "postId",
    ref: "Comment"
});
exports.postSchema.pre("deleteOne", async function () {
    const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
    await comment_model_1.Comment.deleteMany({ postId: filter._id });
});
