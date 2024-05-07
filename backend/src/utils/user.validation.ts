import { z } from "zod";

export const userModelValidation = z.object({
  username: z
    .string()
    .min(3, { message: "User name should be minium of 3 char" })
    .max(25, { message: "Username Cannot be more that the 25 char" })
    .regex(/^[a-zA-Z0-9]+$/),

  email: z.string().email(),

  password: z
    .string()
    .min(3, { message: "User name should be minium of 3 char" })
    .max(25, { message: "Username Cannot be more that the 25 char" }),
});

export const otpSchemaValidation = z.object({
  email: z.string().email(),
  otp: z
    .string()
    .regex(/^[0-9]+$/)
    .max(6, { message: "Otp Must be of 6 digit" }),
});

export const loginSchemaValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(3, { message: "User name should be minium of 3 char" })
    .max(25, { message: "Username Cannot be more that the 25 char" }),
});
