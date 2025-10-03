"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = exports.isValid = void 0;
const zod_1 = require("zod");
const utils_1 = require("../utils");
const isValid = (schema) => {
    return (req, res, next) => {
        let data = { ...req.body, ...req.params, ...req.query };
        const result = schema.safeParse(data);
        if (result.success == false) {
            let errMessage = result.error.issues.map((issues) => ({
                path: issues.path[0],
                message: issues.message,
            }));
            throw new utils_1.BadRequestException("validation error!!", errMessage);
        }
        next();
    };
};
exports.isValid = isValid;
exports.generalFields = {
    fullName: zod_1.z.string().min(3).max(30),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(20),
    phoneNumber: zod_1.z.string(),
    gender: zod_1.z.enum(utils_1.Gender),
    dob: zod_1.z.coerce.date(),
    otp: zod_1.z.number().int().gte(100000).lte(999999),
    content: zod_1.z.string().min(3).max(300),
    reaction: zod_1.z.enum(utils_1.REACTION),
};
