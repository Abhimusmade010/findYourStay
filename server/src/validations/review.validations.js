import  {z} from 'zod'


export const reviewSchemaforValidations = z.object({

//   hotel: z.string().regex(/^[a-f\d]{24}$/i, "Invalid hotel ID"),
//   customer: z.string().regex(/^[a-f\d]{24}$/i, "Invalid customer ID"),

  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(1000),

});



