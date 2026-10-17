import express from "express";
import { todoInsertSchema } from "../db/validation-schemas.js";
import { createTodo, deleteTodoById, getAllTodos, getTodoById, updateTodo } from "../db/queries/todo.queries.js";

export const todoRouter = express.Router();

todoRouter.get("/", async(req, res) => {
    const todos = await getAllTodos();
    return res.status(200).json({data: todos});
});

todoRouter.get("/:id", async(req, res) => {
    const todo = await getTodoById(req.params.id);

    if (todo) {
        return res.status(200).json({data: todo});
    }
    return res.status(404).json({error: "id not found"});
});

todoRouter.post("/", async(req, res) => {
    const body = todoInsertSchema.safeParse(req.body);
    
    if(!body.success) {
        return res.status(422).json({error: "invalid data"});
    }
    
    const todo = await createTodo(body.data.title, body.data.body);
    return res.status(201).json({
        message: "todo got created successfully",
        data: todo
    });
});

todoRouter.patch("/:id", async(req, res) => {
    const body = todoInsertSchema.partial().safeParse(req.body);

    // check if body is empty
    if(!Object.keys(body.data).length){
        return res.status(422).json({error: "no values entered"});
    }

    const todo = await updateTodo(req.params.id, body.data);
    
    if (todo) {    
        return res.status(200).json({
            message: "todo got updated successfully",
            data: todo
        });
    }
    return res.status(404).json({error: "id not found"});   
});

todoRouter.delete("/:id", async(req, res) => {
    const todo = await deleteTodoById(req.params.id);

    if (todo) {
        return res.status(204).end();
    }
    return res.status(404).json({error: "id not found"});
});