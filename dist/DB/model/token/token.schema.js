"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../../../utils");
exports.tokenSchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: Number,
        enum: utils_1.TOKEN_TYPE,
        default: utils_1.TOKEN_TYPE.access
    }
}, { timestamps: true });
