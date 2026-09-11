import z from "zod";

export const loginSchema = z.object({
    email: z.string("email is required"),
    password: z.string("password is required")
});