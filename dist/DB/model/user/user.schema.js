"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const enum_1 = require("../../../utils/common/enum");
const email_1 = require("../../../utils/email");
const dev_config_1 = require("../../../config/env/dev.config");
exports.userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
// userSchema
//   .virtual("fullName")
//   .get(function () {
//     return this.firstName + " " + this.lastName;
//   })
// userSchema.virtual("fullName").set(function (value) {
//     const { firstName, lastName } = value.split(" ");
//     this.firstName = firstName as string;
//     this.lastName = lastName as string;
//   });
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
