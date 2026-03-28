import { z } from "zod";

export const createhotelSchema = z.object({
  
  name: z.string().min(1, "Name is required"),

  description: z.string().min(1, "Description is required"),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    address: z.string().optional(),
  }),

  pricePerNight: z.number().positive("Price per night must be positive"),

  amenities: z.array(z.string()).optional(),

  images: z.array(z.string()).optional(),

  availability: z.boolean().optional(),

  // bookedDates: z.array(z.array(z.date())).optional()
  bookedDates: z.array(
    z.tuple([
      z.string().datetime(),
      z.string().datetime()
    ])
  ).optional()
  // createdBy: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID")
  
  
});