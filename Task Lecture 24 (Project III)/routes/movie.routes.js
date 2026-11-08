import express from "express";
import { Movie } from "../models/Movie.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { uploadOne } from "../middleware/uploads.js";
import { isAuthenticated } from "../middleware/checkAuth.js";
import { validateBody } from "../middleware/validateBody.js";
import { movieSchema } from "../validation-schemas/movie.schema.js";
import { reviewSchema } from "../validation-schemas/review.schema.js";

export const movieRouter = express.Router();

movieRouter.get("/", async (req, res) => {
    const movies = req.query.search ?
                        await Movie.getMovieByTitle(req.query.search) :
                   req.query.actor ?
                        await Movie.getMovieByActor(req.query.actor) :
                        await Movie.getAllMovies();

    return res.status(200).json({
        data: movies
    });
});

movieRouter.get("/:id", validateObjectId, async (req, res) => {
    const movie = await Movie.getMovieById(req.params.id);

    if(!movie) return res.status(404).json({ error : "movie not found" });

    return res.status(200).json({
        data: movie
    });
});

movieRouter.post("/", uploadOne("image"), isAuthenticated, validateBody(movieSchema), async (req, res) => {
    const movie = await Movie.createMovie(req);

    return res.status(201).json({
        message: "movie created successfully",
        data: movie
    });
});

movieRouter.patch("/:id", uploadOne("image"), isAuthenticated, validateObjectId, validateBody(movieSchema.partial()), async (req, res) => {
    const movie = await Movie.updateMovie(req.params.id, req);

    if(!movie) return res.status(404).json({ error : "movie not found" });

    return res.status(200).json({
        message: "movie updated successfully",
        data: movie
    });
});

movieRouter.delete("/:id", isAuthenticated, validateObjectId, async (req, res) => {
    const movie = await Movie.deleteMovie(req.params.id);

    if(!movie) return res.status(404).json({ error : "movie not found" });

    return res.status(200).json({ message: "movie deleted successfully" });
});

movieRouter.post("/:id/reviews", isAuthenticated, validateObjectId, validateBody(reviewSchema), async (req, res) => {
    const movie = await Movie.getMovieById(req.params.id);

    if(!movie) return res.status(404).json({ error : "movie not found" });

    const review = await movie.addReview(req.session.userId, req.body);

    return res.status(201).json({
        message: "review added successfully",
        data: review
    });
});