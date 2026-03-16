

import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name too long"),

    email: z
      .string()
      .email("Invalid email format"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one Number")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one symbol"),
    role: z
      .enum(["Admin", "Customer"])
      .optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});