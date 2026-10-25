import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { comments, users } from "../db/schema.js";

export async function createComment(id, req) {    
    await db
    .insert(comments)
    .values({ 
        post_id: id,
        user_id: req.session.userId,
        content: req.body.content,
        created_at: new Date().toISOString()  
    });

    const [data] = await db
    .select({
        id: comments.id,
        content: comments.content,
        created_at: comments.created_at,
        username: users.username
    })
    .from(comments)
    .innerJoin(users, eq(comments.user_id, users.id))
    .where( and( eq(comments.post_id, id), eq(comments.user_id, req.session.userId) ) )
    .orderBy(desc(comments.created_at));

    return data;
}