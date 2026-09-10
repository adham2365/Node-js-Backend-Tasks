import z from "zod";

export const authorSchema = z.object({
    name: z.string("name is required").trim().min(4, "name must contain 4 or more characters"),
    email: z.email("email is required"),
    age: z.number("age is required").min(20, "age must be at least 20")
});
