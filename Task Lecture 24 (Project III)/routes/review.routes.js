import express from "express";
import { Review } from "../models/Review.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { isAuthenticated } from "../middleware/checkAuth.js";
import { validateBody } from "../middleware/validateBody.js";
import { reviewSchema } from "../validation-schemas/review.schema.js";

export const reviewRouter = express.Router();

reviewRouter.get("/my", isAuthenticated, async (req, res) => {
    const reviews = await Review.getAllReviews();

    return res.status(200).json({
        data: reviews
    });
});

reviewRouter.post("/:movieId", isAuthenticated, validateObjectId, validateBody(reviewSchema), async (req, res) => {
    const review = await Review.addReview(req.session.userId, req.params.movieId, req.body);

    return res.status(200).json({
        message: "review added successfully",
        data: review
    });
});

reviewRouter.patch("/:id", isAuthenticated, validateObjectId, validateBody(reviewSchema.partial()), async (req, res) => {
    const review = await Review.getReviewById(req.params.id);

    if(!review) return res.status(404).json({ error : "review not found" });

    if(review.user._id.toString() !== req.session.userId) {
        return res.status(403).json({ error : "you are not authorized to update this review" });
    }

    const updatedReview = await Review.updateReview(req.params.id, req.body);

    return res.status(200).json({
        message: "review updated successfully",
        data: updatedReview
    });
});

reviewRouter.delete("/:id", isAuthenticated, validateObjectId, async (req, res) => {
    const review = await Review.getReviewById(req.params.id);

    if(!review) return res.status(404).json({ error : "review not found" });

    if(review.user._id.toString() !== req.session.userId) {
        return res.status(403).json({ error : "you are not authorized to delete this review" });
    }

    await Review.deleteReview(req.params.id);

    return res.status(200).json({ message: "review deleted successfully" });
});