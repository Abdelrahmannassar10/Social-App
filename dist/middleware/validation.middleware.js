"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = exports.isValid = void 0;
const zod_1 = require("zod");
const utils_1 = require("../utils");
const isValid = (schema) => {
    return (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query };
        const result = schema.safeParse(data);
        if (!result.success) {
            const errMessage = result.error.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            }));
            throw new utils_1.BadRequestException("Validation error!", errMessage);
        }
        req.body = result.data;
        next();
    };
};
exports.isValid = isValid;
exports.generalFields = {
    fullName: zod_1.z
        .string("Full name is required")
        .min(3, "Full name must be at least 3 characters")
        .max(30, "Full name too long"),
    email: zod_1.z
        .string("Email is required")
        .email("Invalid email address"),
    password: zod_1.z
        .string("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password too long"),
    phoneNumber: zod_1.z
        .string()
        .regex(/^(\+?\d{10,15})$/, "Invalid phone number")
        .optional(),
    gender: zod_1.z.nativeEnum(utils_1.Gender, "Gender is required"),
    dob: zod_1.z
        .coerce.date()
        .refine((date) => !isNaN(date.getTime()), "Invalid date format")
        .optional(),
    otp: zod_1.z
        .number("OTP is required")
        .int()
        .gte(100000, "OTP must be at least 6 digits")
        .lte(999999, "OTP must be 6 digits"),
    content: zod_1.z
        .string("Content is required")
        .min(3, "Content too short")
        .max(300, "Content too long")
        .optional(),
    reaction: zod_1.z.nativeEnum(utils_1.REACTION, "Reaction is required"),
    mentions: zod_1.z.array(zod_1.z.string().email("Invalid email address")).optional(),
};
