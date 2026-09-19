import express from "express";
import { createDB } from "../db.js";

export const ordersRouter = express.Router();
const db = createDB();

ordersRouter.get("/", async(req, res, next) => {
    // get orders
    const orders = await db.getAll("orders");

    // get user orders
    const userOrders = orders.filter(o => String(o.userId) === String(req.user.id));

    // send res
    return res.status(200).json({
        data: userOrders
    });
});

ordersRouter.post("/checkout", async(req, res, next) => {
    // get user cart
    let userCart = await db.getOne("carts", {userId: req.user.id});

    // calculate total price
    const totalPrice = userCart["products"]
                        .map(product => product["price"] * product["quantity"])
                        .reduce((total, currentPrice) => total + currentPrice);
    
    // create order
    const orders = await db.create("orders", {
        userId: req.user.id,
        products: userCart["products"],
        total: totalPrice,
        status: "pending",
        createdAt: new Date().toISOString()
    });

    // empty cart
    await db.update("carts", userCart.id, {
        products: []
    })

    // send res
    return res.status(201).json({
        message: "order placed successfully",
        data: orders
    });
});