import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    year: { type: Number, required: true, min: 1888, max: 2100 },
    title: { type: String, required: true },
    genres: [{ type: String, required: true }],
    description: { type: String, required: true },
    trailerLink: { type: String, required: true },
    image: { type: String },
    director: { type: String, required: true },
    actors: [{ type: mongoose.Types.ObjectId, ref: "Actor" }],
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    methods: {
        async addReview(userId, reviewData) {
            const Review = mongoose.model("Review");
            const review = new Review({
                ...reviewData,
                user: userId,
                movie: this._id
            });
            await review.save();
            return review;
        }
    },
    statics: {
        getAllMovies() {
            return mongoose
                .model("Movie")
                .find();
        },
        getMovieByTitle(title) {
            return mongoose
                .model("Movie")
                .find({ title: { $regex: title, $options: "i" }  });
        },
        getMovieByActor(actorId) {
            return mongoose
                .model("Movie")
                .find({ actors: actorId });
        },
        getMovieById(id) {
            return mongoose
                .model("Movie")
                .findById(id)
                .populate("actors")
                .populate({
                    path: "reviews",
                    populate: {
                        path: "user"
                    }
                });
        },
        createMovie(req) {
            return new Movie({ ...req.body, image: req.file ? req.file.filename : undefined }).save();
        },
        updateMovie(id, req) {
            return mongoose
                .model("Movie")
                .findByIdAndUpdate(id, 
                    { 
                        ...req.body,
                        image: req.file ? req.file.filename : undefined,
                        updatedAt: Date.now()
                    }, { new: true });
        },
        deleteMovie(id) {
            return mongoose
                .model("Movie")
                .findByIdAndDelete(id);
        }
    }
});

movieSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "movie"
});

movieSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ movie: doc._id });
  }
});

export const Movie = mongoose.model("Movie", movieSchema);