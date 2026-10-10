import express from "express";
import { validateBody } from "../middleware/validateBody.js";
import { todoSchema } from "../schema/todo.schema.js";
import { createTodo, deleteTodoById, getAllTodos, getTodoById, updateTodo } from "../db/todo.queries.js";

export const todoRouter = express.Router();

todoRouter.get("/", async(req, res, next) => {
    const todos = await getAllTodos();
    return res.status(200).json({data: todos});
});

todoRouter.get("/:id", async(req, res, next) => {
    const todo = await getTodoById(req.params.id);
    return res.status(200).json({data: todo});
});

todoRouter.post("/", validateBody(todoSchema), async(req, res, next) => {
    const todo = await createTodo(req.body.title, req.body.body);
    return res.status(201).json({
        message: "todo got created successfully",
        data: todo
    });
});

todoRouter.patch("/:id", validateBody(todoSchema.partial()), async(req, res, next) => {
    const todo = await updateTodo(req.params.id, req.body);
    
    if(todo){
        return res.status(200).json({
            message: "todo got updated successfully",
            data: todo
        });
    }

    return res.status(422).json({error: "no values entered"});
});

todoRouter.delete("/:id", async(req, res, next) => {
    const result = await deleteTodoById(req.params.id);

    if(!result){
        return res.status(404).json("not found");
    }
    
    return res.status(204).json({message: "todo got deleted successfully"});
});