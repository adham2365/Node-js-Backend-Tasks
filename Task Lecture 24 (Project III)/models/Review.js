import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    number: { type: Number, required: true, min: 0, max: 10 },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    movie: { type: mongoose.Types.ObjectId, ref: "Movie" },
    comment: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    versionKey: false,
    statics: {
        getReviewById(id) {
            return mongoose
                .model("Review")
                .findById(id)
                .populate("user")
                .populate("movie");
        },
        getAllReviews() {
            return mongoose
                .model("Review")
                .find()
                .populate("user", "_id")
                .populate("movie", "_id title year image");
        },
        addReview(userId, movieId, reviewData) {
            return new Review({
                ...reviewData,
                movie: movieId,
                user: userId
            }).save();
        },
        deleteReview(id) {
            return mongoose
                .model("Review")
                .findByIdAndDelete(id);
        },
        updateReview(id, reviewData) {
            return mongoose
                .model("Review")
                .findByIdAndUpdate(id, {
                    ...reviewData,
                    updatedAt: Date.now()
                }, { new: true });
        }
    }
});

export const Review = mongoose.model("Review", reviewSchema);