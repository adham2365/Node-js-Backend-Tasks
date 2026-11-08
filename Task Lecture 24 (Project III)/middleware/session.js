import session from 'express-session'
import MongoStore from 'connect-mongo'

process.loadEnvFile();

export const createSession = session({
    name: "movie_session",
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "lax"
    }
});