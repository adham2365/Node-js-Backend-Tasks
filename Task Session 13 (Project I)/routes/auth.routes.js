import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createDB } from "../db.js";
import { validateBody } from "../middleware/validateBody.js";
import { registerSchema } from "../schema/auth/register.schema.js";
import { loginSchema } from "../schema/auth/login.schema.js";

export const authRouter = express.Router();
const db = createDB();

authRouter.post("/register", validateBody(registerSchema), async(req, res, next) => {
    // validate data

    // hash password
    const passwordHash = await bcrypt.hash(req.body.password, 10);    

    // check email uniqueness
    const users = await db.getAll("auth_users");
    const user = users.find(u => u.email === req.body.email);
    if(user) {
        return res.status(422).json({
            error: "email already in use"
        });
    } 

    // add to db
    await db.create("auth_users", {
        username: req.body.username,
        email: req.body.email,
        password: passwordHash,
        role: req.body.role
    });

    // send res
    return res.status(201).json({
        message: "register successful, you can now login"
    });
});

authRouter.post("/login", validateBody(loginSchema), async(req, res, next) => {
    // validate data

    // check email
    const users = await db.getAll("auth_users");
    const user = users.find(u => u.email === req.body.email);
    if(!user) {
        return res.status(422).json({
            error: "email or password are invalid"
        });
    }

    // compare password
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if(!isValid) {
        return res.status(422).json({
            error: "email or password are invalid"
        });
    }

    // generate token
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
    }, process.env.JWT_SECRET);

    // create cookie
    res.cookie("node_api_token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
    });

    // send res
    return res.status(200).json({
        message: "login successful",
        data: {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        }
    });
});

authRouter.post("/logout", (req, res, next) => {
    // clear token from cookie
    res.clearCookie("node_api_token");

    // send res
    return res.status(200).json({
        message: "logout successful"
    });
});