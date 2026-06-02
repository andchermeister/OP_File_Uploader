import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "Username can only contain alphanumeric characters and underscores",
    }),

  email: z
    .string({})
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),

  password: z
    .string({ message: "Password is required" })
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password is too long" }),
});

export const loginSchema = z.object({
  username: z
    .string({ message: "Username or email is required" })
    .trim()
    .min(1, { message: "Username or email is required" }),

  password: z.string().min(1, { message: "Password is required" }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
