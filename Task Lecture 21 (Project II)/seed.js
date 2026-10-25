import bcrypt from "bcrypt";
import { seed } from "drizzle-seed";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";
import { asc, eq } from "drizzle-orm";

const demoUsers = [
    { username: "merchant", email: "merchant@demo.com"},
    { username: "customer", email: "customer@demo.com"},
];

async function main() {
    const { sessions, likes, ...seedableSchema } = schema;
    const { users } = schema;

    await seed(db, seedableSchema, { count: 20 });
    
    const passwordHash = await bcrypt.hash("Password1!", 10);
    const rows = await db.select({ id: users.id }).from(users).orderBy(asc(users.id)).limit(2);
    
    for (const [i, user] of demoUsers.entries()) {
        await db.update(users).set({ ...user, password_hash: passwordHash }).where(eq(users.id, rows[i].id));
    }
    
    console.log("Database seeded successfully");
}

main()
.catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
})
.finally(async() => {
    await db.$client.end();
});