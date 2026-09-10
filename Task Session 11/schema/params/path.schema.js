import z from "zod";

export const pathSchema = z
  .string()
  .trim()
  .regex(/^[0-9]+$/, "id must be a number");