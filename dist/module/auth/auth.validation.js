"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmailSchema = exports.updateInfoSchema = exports.updatePasswordSchema = exports.loginSchema = exports.verifyAccountSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const middleware_1 = require("../../middleware");
exports.registerSchema = zod_1.z.object({
    fullName: middleware_1.generalFields.fullName.optional(),
    email: middleware_1.generalFields.email,
    password: middleware_1.generalFields.password,
    phoneNumber: middleware_1.generalFields.phoneNumber.optional(),
    gender: middleware_1.generalFields.gender.optional(),
    dob: middleware_1.generalFields.dob.optional(),
});
exports.verifyAccountSchema = zod_1.z.object({
    email: middleware_1.generalFields.email,
    otp: middleware_1.generalFields.otp,
});
exports.loginSchema = zod_1.z.object({
    email: middleware_1.generalFields.email,
    password: middleware_1.generalFields.password,
});
exports.updatePasswordSchema = zod_1.z.object({
    email: middleware_1.generalFields.email,
    password: middleware_1.generalFields.password,
});
exports.updateInfoSchema = zod_1.z.object({
    fullName: middleware_1.generalFields.fullName.optional(),
    email: middleware_1.generalFields.email,
    password: middleware_1.generalFields.password.optional(),
    phoneNumber: middleware_1.generalFields.phoneNumber.optional(),
    gender: middleware_1.generalFields.gender.optional(),
    dob: middleware_1.generalFields.dob.optional(),
});
exports.updateEmailSchema = zod_1.z.object({
    email: middleware_1.generalFields.email,
    newEmail: middleware_1.generalFields.email,
});
