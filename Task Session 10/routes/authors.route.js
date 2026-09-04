import express from "express";
import { createDB } from "../db.js";

export const authorRouter = express.Router();
const db = createDB();

authorRouter.use(express.json());

authorRouter.get("/", async (req, res) => {
    // get all authors
    const authors = await db.getAll("authors");
    
    // check query
    if (req.query.search) {
        // get name
        const name = req.query.search;
        
        // search for authors by name
        const selectedAuthors = authors.filter(x => String(x.name).toLowerCase().startsWith(String(name).toLowerCase()));
    
        if (selectedAuthors.length !== 0) {
            // send as json
            res.json({
                data: selectedAuthors,
            });

        } else {
            // names doesn't exist
            res.status(404).json({
                message: "authors not found",
            });
        };

    } else {
        // send as json
        res.json({
            data: authors,
        });
    }
});

authorRouter.get("/:id", async (req, res) => {
    // get author
    const author = await db.getById("authors", req.params.id);

    // check author's id
    if (author) {
        // send as json
        res.json({
            data: author,
        });

    } else {
        // author not found
        res.status(404).json({
            message: "author not found",
        });

    }
});


authorRouter.post("/", async (req, res) => {
    // read data from the body
    const data = req.body;

    // write into the database
    const author = await db.create("authors", data);
    
    // send message and data as json
    res.status(201).json({
        message: "author created successfully",
        data : author,
    });
});

authorRouter.patch("/:id", async (req, res) => {
    // get id
    const id = req.params.id;

    // check author's id
    const author = await db.getById("authors", id);

    if (author) {
        // read the body
        const newAuthor = req.body;
        
        // update author in the database
        await db.update("authors", id, newAuthor);

        // send message as json
        res.json({
            message: "author updated successfully",
        });

    } else {
        // author is undefined
        res.status(404).json({
            message: "author not found",
        });
    }
});

authorRouter.delete("/:id", async (req, res) => {
    // get id
    const id = req.params.id;

    // check author's id
    const author = await db.getById("authors", id);

    if (author) {
        // delete author from the database
        await db.delete("authors", id);

        // return message as json
        res.status(204).json({
            message: "author deleted successfully",
        });

    } else {
        // author is undefined
        res.status(404).json({
            message: "author not found",
        });
    }
});