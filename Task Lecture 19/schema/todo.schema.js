import z from "zod";

export const todoSchema = z.object({
    title: z.string("title field is required").max(30, "title field has at most 30 charactes"),
    body: z.string("body field is required"),
    done: z.preprocess((value) => (typeof value === "string" ? value.toLowerCase() : value), 
        z.enum(['yes', 'no']).default("no"))
});