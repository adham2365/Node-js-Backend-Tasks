import z from "zod";

export const searchSchema = z
  .string()
  .trim()
  .min(4, "search must contain 4 or more characters")
  .regex(/^[a-zA-Z]+$/, "search must contain alphabet letters");