import express from "express";
import { Actor } from "../models/Actor.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { isAuthenticated } from "../middleware/checkAuth.js";
import { validateBody } from "../middleware/validateBody.js";
import { actorSchema } from "../validation-schemas/actor.schema.js";
import { uploadMany } from "../middleware/uploads.js";

export const actorRouter = express.Router();

actorRouter.get("/", async (req, res) => {
    const actors = req.query.search ?
                        await Actor.getActorByName(req.query.search) :
                        await Actor.getAllActors();

    return res.status(200).json({
        data: actors
    });
});

actorRouter.get("/:id", validateObjectId, async (req, res) => {
    const actor = await Actor.getActorById(req.params.id);

    if(!actor) return res.status(404).json({ error : "actor not found" });

    return res.status(200).json({
        data: actor
    });
});

actorRouter.post("/", uploadMany("images"),isAuthenticated, validateBody(actorSchema), async (req, res) => {
    const actor = await Actor.createActor(req);

    return res.status(201).json({
        message: "actor created successfully",
        data: actor
    });
});

actorRouter.patch("/:id", uploadMany("images"), isAuthenticated, validateObjectId, validateBody(actorSchema.partial()), async (req, res) => {
    const actor = await Actor.updateActor(req.params.id, req);

    if(!actor) return res.status(404).json({ error : "actor not found" });

    return res.status(200).json({
        message: "actor updated successfully",
        data: actor
    });
});

actorRouter.delete("/:id", isAuthenticated, validateObjectId, async (req, res) => {
    const actor = await Actor.deleteActor(req.params.id);

    if(!actor) return res.status(404).json({ error : "actor not found" });

    return res.status(200).json({ message: "actor deleted successfully" });
});