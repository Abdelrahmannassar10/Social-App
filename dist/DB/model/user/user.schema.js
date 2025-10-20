"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const enum_1 = require("../../../utils/common/enum");
const email_1 = require("../../../utils/email");
const dev_config_1 = require("../../../config/env/dev.config");
exports.userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            if (this.userAgent == enum_1.USER_AGENT.google) {
                return false;
            }
            else {
                return true;
            }
        },
    },
    role: {
        type: Number,
        enum: enum_1.SYS_ROLE,
        default: enum_1.SYS_ROLE.USER,
    },
    otp: { type: Number },
    otpExpiryAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    credentialUpdatedAt: { type: Date, default: Date.now },
    phoneNumber: { type: String },
    gender: {
        type: Number,
        enum: enum_1.Gender,
    },
    dob: { type: Date },
    userAgent: {
        type: Number,
        enum: enum_1.USER_AGENT,
        default: enum_1.USER_AGENT.local,
    },
    isTwoStepEnable: {
        type: Boolean,
        default: false,
    },
    tempEmail: {
        type: String,
    },
    oldEmailOTP: {
        type: String,
    },
    newEmailOTP: {
        type: String,
    },
    friends: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }],
    blockedUsers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.userSchema.virtual("fullName").get(function () {
    return this.firstName + " " + this.lastName;
});
exports.userSchema.virtual("fullName").set(function (value) {
    const { firstName, lastName } = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
});
exports.userSchema.pre("save", async function (next) {
    if (this.userAgent !== enum_1.USER_AGENT.google || this.isNew == true) {
        await (0, email_1.sendMail)({
            to: this.email,
            subject: "Welcome to Social App",
            html: dev_config_1.devConfig.OTP_Body(this.otp.toString()),
        });
    }
    next();
});
