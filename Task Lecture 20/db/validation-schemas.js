import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { todos } from "./schema.js";
import z from "zod";

export const todoSelectSchema = createSelectSchema(todos);
export const todoInsertSchema = createInsertSchema(todos, {
    done: z.preprocess((value) => (typeof value === "string" ? value.toLowerCase() : value),
    z.enum(['yes', 'no']).optional())
});