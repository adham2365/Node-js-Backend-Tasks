import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    birthdate: Date,
    images: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    statics: {
        getAllActors() {
            return mongoose
                .model("Actor")
                .find();
        },
        getActorByName(name) {
            return mongoose
                .model("Actor")
                .find({ name: { $regex: name, $options: "i" } });
        },
        getActorById(id) {
            return mongoose
                .model("Actor")
                .findById(id)
                .populate("movies", "_id title year image");
        },
        createActor(req) {
            return new Actor({
                ...req.body,
                images: req.files ? req.files.map(file => file.filename) : []
            }).save();
        },
        updateActor(id, req) {
            return mongoose
                .model("Actor")
                .findByIdAndUpdate(id, 
                    {
                        ...req.body,
                        images: req.files ? req.files.map(file => file.filename) : [],
                        updatedAt: Date.now()
                    }, { new: true });
        },
        deleteActor(id) {
            return mongoose
                .model("Actor")
                .findByIdAndDelete(id);
        }
    }
});

actorSchema.virtual("movies", {
    ref: "Movie",
    localField: "_id",
    foreignField: "actors"
});

actorSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await mongoose.model("Movie").updateMany(
      { actors: doc._id },
      { $pull: { actors: doc._id } }
    );
  }
});

export const Actor = mongoose.model("Actor", actorSchema);