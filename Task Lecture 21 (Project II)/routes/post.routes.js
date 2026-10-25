import express from "express";
import { isAuthenticated } from "../middleware/checkAuth.js";
import { createPost, findPostById, getAllPosts, getOnePost, toggleLike } from "../queries/post.queries.js";
import { uploadImage } from "../middleware/upload.js";
import { validateBody } from "../middleware/validateBody.js";
import { insertCommentSchema, insertPostSchema } from "../validation-schemas/posts .js";
import { createComment } from "../queries/comment.queries.js";

export const postRouter = express.Router();

postRouter.get("/", isAuthenticated, async (req, res) => {
    const data = await getAllPosts(req.session.userId);

    return res.status(200).json({ data });
});

postRouter.get("/:id", isAuthenticated, async (req, res) => {
    const isPresent = await findPostById(req.params.id);
    if(!isPresent){
        return res.status(404).json({ error: "post not found" });
    }
    
    const data = await getOnePost(req.params.id, req.session.userId);

    return res.status(200).json({ data });
});

postRouter.post("/", isAuthenticated, uploadImage("image"), validateBody(insertPostSchema), async (req, res) => {
    const data = await createPost(req);

    return res.status(201).json({
        message: "post created successfully",
        data
    });
});

postRouter.post("/:id/like", isAuthenticated, async (req, res) => {
    const isPresent = await findPostById(req.params.id);
    if(!isPresent){
        return res.status(404).json({ error: "post not found" });
    }
    
    const data = await toggleLike(req.params.id, req.session.userId);

    return res.status(200).json({ data });
});

postRouter.post("/:id/comments", isAuthenticated, validateBody(insertCommentSchema), async (req, res) => {
    const isPresent = await findPostById(req.params.id);
    if(!isPresent){
        return res.status(404).json({ error: "post not found" });
    }
    
    const data = await createComment(req.params.id, req);
    
    return res.status(201).json({
        message: "comment created successfully",
        data
    })
});
