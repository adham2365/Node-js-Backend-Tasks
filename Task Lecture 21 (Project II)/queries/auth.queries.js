import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function register(body, password) {
    await db
    .insert(users)
    .values({
        username: body.username,
        email: body.email,
        password_hash: password
    });
}   

export async function me(userId) {
    const [user] = await db
    .select({
        id: users.id,
        username: users.username,
        email: users.email
    })
    .from(users)
    .where(eq(users.id, userId));

    return user;
}

export async function checkUserByEmail(email) {
    const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

    return user;
}