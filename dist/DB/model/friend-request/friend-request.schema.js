"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRequestSchema = void 0;
const mongoose_1 = require("mongoose");
exports.friendRequestSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
