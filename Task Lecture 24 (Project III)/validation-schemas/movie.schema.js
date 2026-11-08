import z from "zod";

const toArray = (v) => (v === undefined || v === "" ? [] : Array.isArray(v) ? v : [v]);
const actorArray = (v) => {
    if (v === undefined || v === "") return [];
    if (Array.isArray(v)) return v.flatMap(actorArray);
    if (typeof v === "string") {
        try {
            const parsed = JSON.parse(v);
            if (Array.isArray(parsed)) return parsed;
        } catch {}
        return [v];
    }
    return [v];
};

export const movieSchema = z.object({
    year: z.coerce.number("Year is required").min(1888, "Year must be a number between 1888 and 2100").max(2100, "Year must be a number between 1888 and 2100"),
    title: z.string("Title is required"),
    genres: z.preprocess(toArray, z.array(z.string("Genre is required"))),
    description: z.string("Description is required"),
    trailerLink: z.string("Trailer link is required").url("Trailer link must be a valid URL"),
    image: z.string().optional(),
    director: z.string("Director is required"),
    actors: z.preprocess(actorArray, z.array(z.string())).optional()
});