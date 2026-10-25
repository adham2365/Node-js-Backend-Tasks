import { createInsertSchema } from "drizzle-orm/zod";
import { comments, posts } from "../db/schema.js";

export const insertPostSchema = createInsertSchema(posts, {
    content: (schema) => schema.min(1, { message: "post content cannot be empty"}).max(5000)
})
.omit({ id: true, user_id: true, created_at: true })
.required({ content: true });

export const insertCommentSchema = createInsertSchema(comments, {
    content: (schema) => schema.min(1).max(2000)
})
.omit({ id: true, post_id: true, user_id: true, created_at: true })
.required({ content: true });