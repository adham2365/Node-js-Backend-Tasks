import z from "zod";

export const cartSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.coerce.number("quantity must be a number"),
    image: z.string(),
    quantity: z.coerce.number("quantity must be a number").positive("quantity must be positive")
});