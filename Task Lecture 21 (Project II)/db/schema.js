import { defineRelations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp, varchar, primaryKey, json } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", {length: 255}).notNull(),
    email: varchar("email", {length: 255}).unique(),
    password_hash: varchar("password_hash", {length:255}).notNull(),
    created_at: timestamp("created_at").defaultNow()
});

export const sessions = pgTable("sessions", {
    sid: varchar("sid", {length: 255}).primaryKey(),
    session_id: varchar("session_id", {length: 255}).unique(),
    user_id: integer("user_id").references(() => users.id),
    sess: json("sess").notNull(),
    expire: timestamp("expire", {precision: 6}).notNull(),
    created_at: timestamp("created_at").defaultNow()
});

export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => users.id),
    content: text("content"),
    image: varchar("image", {length:255}),
    created_at: timestamp("created_at").defaultNow()
});

export const comments = pgTable("comments", {
    id: serial("id").primaryKey(),
    post_id: integer("post_id").notNull().references(() => posts.id),
    user_id: integer("user_id").notNull().references(() => users.id),
    content: text("content"),
    created_at: timestamp("created_at").defaultNow()
});

export const likes = pgTable("likes", {
    post_id: integer("post_id").notNull().references(() => posts.id),
    user_id: integer("user_id").notNull().references(() => users.id),
    created_at: timestamp("created_at").defaultNow()
},
(table) => [primaryKey({ columns: [table.post_id, table.user_id] })]
);

export const relations = defineRelations({users, sessions, posts, comments, likes},
    (r) => ({
        users: {
            sessions: r.one.sessions({
                from: r.users.id,
                to: r.sessions.user_id
            }),
            posts: r.many.posts({
                from: r.users.id,
                to: r.posts.user_id
            }),
            comments: r.many.comments({
                from: r.users.id,
                to: r.comments.user_id
            }),
            likes: r.one.likes({
                from: r.users.id,
                to: r.likes.user_id
            })
        },

        sessions: {
            users: r.one.users()
        },

        posts: {
            users: r.one.users(),
            comments: r.many.comments({
                from: r.posts.id,
                to: r.comments.post_id
            }),
            likes: r.many.likes({
                from: r.posts.id,
                to: r.likes.post_id
            })
        },

        comments: {
            users: r.one.users(),
            posts: r.one.posts()
        },

        likes: {
            users: r.one.users(),
            posts: r.one.posts()
        },
    })
);