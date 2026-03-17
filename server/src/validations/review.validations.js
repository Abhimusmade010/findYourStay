import  {z} from 'zod'

export const reviewSchemaforValidations = z.object({

  hotel: z.string().regex(/^[a-f\d]{24}$/i, "Invalid hotel ID"),
  customer: z.string().regex(/^[a-f\d]{24}$/i, "Invalid customer ID"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1, "Comment is required").max(1000, "Comment too long"),

});