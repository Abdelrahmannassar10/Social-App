"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3).max(30),
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6).max(20),
    phoneNumber: zod_1.z.string(),
    gender: zod_1.z.enum(utils_1.Gender),
    dob: zod_1.z.date(),
});
