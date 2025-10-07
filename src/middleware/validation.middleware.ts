import { z, ZodType } from "zod";
import { NextFunction, Request, Response } from "express";
import { BadRequestException, Gender, REACTION } from "../utils";


export const isValid = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const result = schema.safeParse(data);

    if (!result.success) {
      const errMessage = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      throw new BadRequestException("Validation error!", errMessage);
    }

    req.body = result.data;
    next();
  };
};

export const generalFields = {
  fullName: z
    .string("Full name is required" )
    .min(3, "Full name must be at least 3 characters")
    .max(30, "Full name too long"),

  email: z
    .string( "Email is required" )
    .email("Invalid email address"),

  password: z
    .string( "Password is required" )
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password too long"),

  phoneNumber: z
    .string()
    .regex(/^(\+?\d{10,15})$/, "Invalid phone number")
    .optional(),

  gender: z.nativeEnum(Gender,  "Gender is required" ),

  dob: z
    .coerce.date()
    .refine((date) => !isNaN(date.getTime()), "Invalid date format")
    .optional(),

  otp: z
    .number( "OTP is required" )
    .int()
    .gte(100000, "OTP must be at least 6 digits")
    .lte(999999, "OTP must be 6 digits"),

  content: z
    .string("Content is required" )
    .min(3, "Content too short")
    .max(300, "Content too long")
    .optional(),

  reaction: z.nativeEnum(REACTION,"Reaction is required" ),
  mentions: z.array(z.string().email("Invalid email address")).optional(),
};
