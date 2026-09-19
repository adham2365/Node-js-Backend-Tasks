import z from "zod";

export const productSchema = z.object({
    name: z.string("name is required").min(1),
    description: z.string("description is required").min(1),
    price: z.coerce.number("price must be a number").positive("price must be positive"),
    image: z.url().or(z.literal(""))
});