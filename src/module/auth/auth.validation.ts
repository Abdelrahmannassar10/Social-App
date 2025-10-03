import { z } from "zod";
import { generalFields } from "../../middleware";

export const registerSchema = z.object({
  fullName: generalFields.fullName.optional(),
  email: generalFields.email.email(),
  password: generalFields.password.min(6).max(20),
  phoneNumber: generalFields.phoneNumber.optional(),
  gender: generalFields.gender.optional(),
  dob: generalFields.dob.optional(),
});
export const loginSchema =z.object({
  email:generalFields.email,
  password:generalFields.password
});
export const verifyAccountSchema =z.object({
  otp:generalFields.otp
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type VerifyAccountDTO = z.infer<typeof verifyAccountSchema>;

