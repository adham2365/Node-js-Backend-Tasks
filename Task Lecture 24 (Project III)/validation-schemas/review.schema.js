import z from "zod";

export const reviewSchema = z.object({
    number: z.coerce.number().min(0, "Rating score must be between 0 and 10").max(10, "Rating score must be between 0 and 10"),
    comment: z.string().optional(),
});