import express from "express";
import bcrypt from "bcrypt";
import { checkUserByEmail, me, register } from "../queries/auth.queries.js";
import { validateBody } from "../middleware/validateBody.js";
import { loginSchema, registerSchema } from "../validation-schemas/auth.js";
import { isAuthenticated } from "../middleware/checkAuth.js";

export const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), async (req, res) => {
    const existingUser = await checkUserByEmail(req.body.email);
    if(existingUser){
        return res.status(422).json({
            errors: {
                email: { errors: ["email already in use"] }
            }
        });
    }

    const password_hash = await bcrypt.hash(req.body.password, 10);

    await register(req.body, password_hash);

    return res.status(201).json({message: "register successful, you can now login"});
});

authRouter.post("/login", validateBody(loginSchema), async (req, res) => {
    const user = await checkUserByEmail(req.body.email);
    if(!user){
        return res.status(401).json({ error: "invalid email or password" });
    }

    // compare password
    const isValid = await bcrypt.compare(req.body.password, user.password_hash);
    if(!isValid){
        return res.status(401).json({ error: "invalid email or password" });
    }

    // create session
    req.session.regenerate((err) => {
        if (err) return next(err);
        req.session.userId = user.id;
        
        // send res
        return res.status(200).json({
            message: "login successful",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username
                }
            }
        });
    });
});

authRouter.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return next(err);

        res.clearCookie("blog_session");
        return res.status(200).json({ message: "logout successful" });
    });
});

authRouter.get("/me", isAuthenticated, async (req, res) => {
    const data = await me(req.session.userId);
    
    return res.status(200).json({
        data: { 
            user: data
        }
    });
});