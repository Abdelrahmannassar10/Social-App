import { z } from "zod";
import { BadRequestException, Gender, REACTION } from "../utils";
import { NextFunction, Request, Response } from "express";
import { email, ZodType } from "zod";

export const isValid = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let data = { ...req.body, ...req.params, ...req.query };
    const result = schema.safeParse(data);
    if (result.success == false) {
      let errMessage = result.error.issues.map((issues) => ({
        path: issues.path[0],
        message: issues.message,
      }));
      throw new BadRequestException("validation error!!", errMessage);
    }
    next();
  };
};
export const generalFields = {
  fullName: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(20),
  phoneNumber: z.string(),
  gender: z.enum(Gender),
  dob: z.coerce.date(),
  otp: z.number().int().gte(100000).lte(999999),
  content:z.string().min(3).max(300),
  reaction:z.enum(REACTION),
};
