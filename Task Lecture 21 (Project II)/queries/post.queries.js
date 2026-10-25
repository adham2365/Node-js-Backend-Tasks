import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { comments, likes, posts, users } from "../db/schema.js";

export async function getAllPosts(userId) {
    const result = await db
    .select({
      id: posts.id,
      content: posts.content,
      image: posts.image,
      created_at: posts.created_at,
      username: users.username,
      comment_count: count(comments.post_id)
    })
    .from(posts)
    .innerJoin(users, eq(users.id, posts.user_id))
    .leftJoin(comments, eq(comments.post_id, posts.id))
    .groupBy(
        posts.id,
        posts.content,
        posts.image,
        posts.created_at,
        users.username
    )
    .orderBy(desc(posts.created_at))
    
    const promises = result.map(async (row) => ({
        ...row,
        like_count: await countLikesById(row.id),
        liked_by_me: await likedByUser(row.id, userId)
    }));

    const data = await Promise.all(promises);
    
    return data;
};

export async function createPost(req) {
    const [data] = await db
    .insert(posts)
    .values({
        user_id: req.session.userId,
        content: req.body.content,
        image: req.file? req.file.filename : null,
        created_at: new Date().toISOString()
    })
    .returning();

    return data;
};

export async function getOnePost(id, userId) {
    const [data] = await db
    .select({
      id: posts.id,
      content: posts.content,
      image: posts.image,
      created_at: posts.created_at,
      username: users.username,
      comment_count: count(comments.post_id)
    })
    .from(posts)
    .innerJoin(users, eq(users.id, posts.user_id))
    .leftJoin(comments, eq(comments.post_id, posts.id))
    .groupBy(
        posts.id,
        posts.content,
        posts.image,
        posts.created_at,
        users.username
    )
    .where(eq(posts.id, id));

    const postComments = await db
        .select({
            id: comments.id,
            content: comments.content,
            created_at: comments.created_at,
            username: users.username
        })
        .from(comments)
        .innerJoin(users, eq(comments.user_id, users.id))
        .where(eq(comments.post_id, id))
        .orderBy(comments.created_at);

    const likeCount = await countLikesById(id);
    const likedByMe = await likedByUser(id, userId);

    return {
        post: {
            ...data,
            like_count: likeCount,
            liked_by_me: likedByMe
        },
        comments: postComments
    }
};

export async function toggleLike(id, userId) {
    const isLiked = await likedByUser(id, userId);

    if(isLiked) { // toggle unlike
        await db
        .delete(likes)
        .where( and( eq(likes.post_id, id), eq(likes.user_id, userId) ) );

    } else { // toggle like
        await db
        .insert(likes)
        .values({
            post_id: id,
            user_id: userId
        });
    }

    const likeCount = await countLikesById(id);    
    
    return {
        liked: !isLiked,
        like_count: likeCount
    };
}

export async function findPostById(id) {
    const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id));
    
    return Object.keys(post).length;
}

async function countLikesById(id) {
    const [likeCount] = await db
    .select({
        like_count: count(likes.post_id)
    })
    .from(posts)
    .leftJoin(likes, eq(likes.post_id, posts.id))
    .where(eq(posts.id, id));

    return likeCount.like_count;
}

async function likedByUser(id, userId) {
    const isLiked = await db
    .select()
    .from(likes)
    .where( and( eq(likes.post_id, id), eq(likes.user_id, userId) ) );
    
    return isLiked.length > 0;
}