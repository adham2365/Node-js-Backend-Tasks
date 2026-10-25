import expressSession from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "../db/index.js";

const pgSession = connectPgSimple(expressSession);

export const createSession = expressSession({
    name: "blog_session",
    store: new pgSession({ pool, tableName : "sessions" }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "lax"
    }
});