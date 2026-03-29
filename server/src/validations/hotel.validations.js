import { z } from "zod";
export const createhotelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),

  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),

  pricePerNight: z.coerce.number().positive("Price must be positive"),

  amenities: z.array(z.string()).optional(),

  availability: z.coerce.boolean().optional(),

  bookedDates: z.array(
    z.tuple([
      z.string().datetime(),
      z.string().datetime()
    ])
  ).optional()
});