"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const enum_1 = require("../../utils/common/enum");
exports.userSchema = new mongoose_1.Schema({
    lastName: { type: String, required: true, minlength: 3, maxlength: 30 },
    firstName: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true },
    password: {
        type: String, required: function () {
            if (this.userAgent == enum_1.USER_AGENT.google) {
                return false;
            }
            else {
                return true;
            }
        },
    },
    role: { type: String, enum: enum_1.SYS_ROLE, default: enum_1.SYS_ROLE.USER },
    otp: { type: String },
    otpExpiryAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    credentialUpdatedAt: { type: Date, default: Date.now },
    phoneNumber: { type: String },
    gender: { type: String, enum: enum_1.Gender },
    dob: { type: Date },
    userAgent: { type: String, enum: enum_1.USER_AGENT, default: enum_1.USER_AGENT.local }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.userSchema.virtual("fullName").get(function () {
    return this.firstName + " " + this.lastName;
}).set(function (value) {
    const { firstName, lastName } = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
});
