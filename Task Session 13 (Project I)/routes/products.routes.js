import express from "express";
import { createDB } from "../db.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkRole } from "../middleware/checkRole.js";
import { validateBody } from "../middleware/validateBody.js";
import { productSchema } from "../schema/product.schema.js";

export const productsRouter = express.Router();
const db = createDB();

productsRouter.get("/", async(req, res, next) => {
    // get all products
    const products = await db.getAll("products");
    
    // check query
    if(req.query.search) {
        const str = req.query.search; // str could be a name or description
        const matchedProducts = products.filter(
            p => String(p.name).toLowerCase().startsWith(String(str).trim().toLowerCase())
            || String(p.description).toLowerCase().startsWith(String(str).trim().toLowerCase())
        );
        
        // send matched product(s)
        return res.status(200).json({
            data: matchedProducts
        });
    }
    
    // send products
    return res.status(200).json({
            data: products
        });
});

productsRouter.get("/:id", async(req, res, next) => {
    // find the desired product
    const product = await db.getById("products", req.params.id);

    // check product existence
    if(!product) {
        return res.status(404).json("product not found");
    }
    
    // send res
    return res.status(200).json({
            data: product
        });
});

productsRouter.post("/", checkAuth, checkRole("merchant"), validateBody(productSchema), async(req, res, next) => {
    // check auth & role
    // validate body

    // add to db
    const product = await db.create("products", req.body);
    
    // send res
    return res.status(201).json({
        message: "product created successfully",
        data: product
    });

});

productsRouter.patch("/:id", checkAuth, checkRole("merchant"), validateBody(productSchema.partial()), async(req, res, next) => {
    // check auth & role
    // validate body

    // check product
    const product = await db.getById("products", req.params.id);
    if(!product) {
        return res.status(404).json("product not found");
    }

    // update product
    await db.update("products", req.params.id, req.body);

    // send res
    return res.status(200).json({
        message: "product updated successfully",
        data: {
            ...product,
            ...req.body
        }
    });
});

productsRouter.delete("/:id", checkAuth, checkRole("merchant"), async(req, res, next) => {
    // check auth & role

    // check product 
    const product = await db.getById("products", req.params.id);
    if(!product) {
        return res.status(404).json("product not found");
    }

    // delete product
    await db.delete("products", req.params.id);

    // get products
    const products = await db.getAll("products");

    // send res
    return res.status(204).json({
        data: products
    });
});