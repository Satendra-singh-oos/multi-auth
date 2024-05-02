import { z } from "zod";

const singupSchemaValidation = z.object({
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
