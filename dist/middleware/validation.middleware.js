"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const utils_1 = require("../utils");
const isValid = (schema) => {
    return (req, res, next) => {
        let data = { ...req.body, ...req.params, ...req.query };
        const result = schema.safeParse(data);
        if (result.success == false) {
            let errMessage = result.error.issues.map((issues) => ({
                path: issues.path[0],
                message: issues.message
            }));
            throw new utils_1.BadRequestException("validation error!!", errMessage);
        }
        next();
    };
};
exports.isValid = isValid;
