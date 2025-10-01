import { z } from "zod";
import { Gender } from "../../utils";

export const registerSchema = z.object({
  fullName: z.string().min(3).max(30).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(20),
  phoneNumber: z.string().optional(),
  gender: z.enum(Gender).optional(),
  dob: z.coerce.date().optional(),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
