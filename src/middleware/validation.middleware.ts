
import { BadRequestException } from "../utils";
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const isValid = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let data = {...req.body,...req.params ,...req.query}
        const result = schema.safeParse(data);
        if (result.success == false) {
            let errMessage = result.error.issues.map((issues) => ({
                path: issues.path[0],
                message: issues.message
            }));
            throw new BadRequestException("validation error!!", errMessage);
        }
    }
}