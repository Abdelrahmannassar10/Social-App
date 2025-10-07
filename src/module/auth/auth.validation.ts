import { z } from "zod";
import { generalFields } from "../../middleware";

export const registerSchema = z.object({
  fullName: generalFields.fullName.optional(),
  email: generalFields.email,
  password: generalFields.password,
  phoneNumber: generalFields.phoneNumber.optional(),
  gender: generalFields.gender.optional(),
  dob: generalFields.dob.optional(),
});
export const verifyAccountSchema = z.object({
  email: generalFields.email,
  otp: generalFields.otp,
});

export const loginSchema = z.object({
  email: generalFields.email,
  password: generalFields.password,
});

export const updatePasswordSchema = z.object({
  email: generalFields.email,
  password: generalFields.password,
});

export const updateInfoSchema = z.object({
  fullName: generalFields.fullName.optional(),
  email: generalFields.email,
  password: generalFields.password.optional(),
  phoneNumber: generalFields.phoneNumber.optional(),
  gender: generalFields.gender.optional(),
  dob: generalFields.dob.optional(),
});

export const updateEmailSchema = z.object({
  email: generalFields.email,
  newEmail: generalFields.email, 
});


