import z from "zod";

const toArray = (v) => (v === undefined || v === "" ? [] : Array.isArray(v) ? v : [v]);

export const actorSchema = z.object({
    name: z.string("Actor name is required"),
    birthdate: z.coerce.date().optional(),
    images: z.preprocess(toArray, z.array(z.string()).max(5).optional())
});