import { z } from "zod";


export const registerUserSchema = z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name too long"),

    email: z
      .string()
      .email("Invalid email format"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one Number")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one symbol"),
      
    role: z
      .enum(["Admin", "Customer"])
      .optional()
});

export const loginSchema = z.object({
  
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
  
});