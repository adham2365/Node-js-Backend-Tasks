import express from "express";
import { createDB } from "../db.js";

export const debugRouter = express.Router();
const db = createDB();

debugRouter.get("/", async(req, res, next) => {
    // define resources
    const resources = ["auth_users", "products", "carts", "orders"];
    const data = {};
    
    // get each resource
    for (let index = 0; index < resources.length; index++) {
        data[resources[index]] = await db.getAll(resources[index]);
    }

    // send res
    return res.status(200).json({
        data: data
    })
});