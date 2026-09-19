import express from "express";
import { createDB } from "../db.js";
import { validateBody } from "../middleware/validateBody.js";
import { cartSchema } from "../schema/cart.schema.js";

export const cartRouter = express.Router();
const db = createDB();

cartRouter.get("/", async(req, res, next) => {
    // get user's cart
    const userCart = await db.getOne("carts", {userId: req.user.id});
    
    // if no cart found
    if(!userCart) {
        return res.status(404).json({
            data: {
                id: null,
                userId: req.user.id,
                products: []
            }
        });
    }

    // send res
    return res.status(200).json({
        data: {
            ...userCart
        }
    });
});

cartRouter.post("/", validateBody(cartSchema), async(req, res, next) => {
    // validate data

    // check user's cart
    const userCart = await db.getOne("carts", {userId: req.user.id});
    
    // if no cart ---> create and add
    if(!userCart) {
        await db.create("carts", {
            userId: req.user.id,
            products: [req.body]
        });        

    // if cart exists ---> add
    } else {
        // get product       
        const product = userCart["products"].find(p => String(p.id) === String(req.body.id));

        // check product existence
        if(!product) {
            // add to products
            userCart["products"].push(req.body);
        
        } else {
            // increase product quantity           
            product["quantity"] += 1;
        }

        // add configuration to db
        await db.update("carts", userCart.id, {
            products: userCart["products"]
        });
    }
    
    // send res
    return res.status(201).json({
        message: "product added to cart",
        data: userCart
    });
});

cartRouter.patch("/:productId", validateBody(cartSchema.partial()), async(req, res, next) => {
    // validate data

    // get user's cart
    const userCart = await db.getOne("carts", {userId: req.user.id});

    // get product
    const product = userCart["products"].find(p => String(p.id) === String(req.params.productId));

    // update quantity       
    product["quantity"] = req.body.quantity;

    // add configuration to db
    await db.update("carts", userCart.id, {
        products: userCart["products"]
    });

    // send res
    return res.status(200).json({
        message: "cart updated",
        data: userCart
    });
});

cartRouter.delete("/:productId", async(req, res, next) => {
    // get user's cart
    const userCart = await db.getOne("carts", {userId: req.user.id});
    
    // delete product
    const newProducts = userCart["products"].filter(p => String(p.id) !== String(req.params.productId))
        
    // add configuration to db
    await db.update("carts", userCart.id, {
        products: newProducts
    });
    
    // send res
    return res.status(200).json({ message: "product removed from cart" });
});