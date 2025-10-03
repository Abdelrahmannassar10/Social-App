"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccountSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const middleware_1 = require("../../middleware");
exports.registerSchema = zod_1.z.object({
    fullName: middleware_1.generalFields.fullName.optional(),
    email: middleware_1.generalFields.email.email(),
    password: middleware_1.generalFields.password.min(6).max(20),
    phoneNumber: middleware_1.generalFields.phoneNumber.optional(),
    gender: middleware_1.generalFields.gender.optional(),
    dob: middleware_1.generalFields.dob.optional(),
});
exports.loginSchema = zod_1.z.object({
    email: middleware_1.generalFields.email,
    password: middleware_1.generalFields.password
});
exports.verifyAccountSchema = zod_1.z.object({
    otp: middleware_1.generalFields.otp
});
