import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { todos } from "../schema.js";

export async function getAllTodos(){
    const data = await db.select().from(todos);
    return data;
}

export async function getTodoById(id){
    const data = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
    return data.length ? data[0] : false;
}

export async function createTodo(title, body){
    const data = await db.insert(todos).values({
        title: title,
        body: body
    }).returning();
    return data[0];
}

export async function updateTodo(id, body){    
    const data = await db.update(todos).set(body).where(eq(todos.id, id)).returning();    
    return data.length ? data[0] : false;
}

export async function deleteTodoById(id){
    const data = await db.delete(todos).where(eq(todos.id, id)).returning();
    return data.length ? data[0] : false;
}