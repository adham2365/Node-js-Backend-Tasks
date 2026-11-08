import express from "express";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { validateBody } from "../middleware/validateBody.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../validation-schemas/auth.schema.js";
import { User } from "../models/User.js";
import { uploadOne } from "../middleware/uploads.js";

process.loadEnvFile();
export const authRouter = express.Router();

const resetCode = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

authRouter.post("/register", uploadOne("image"), validateBody(registerSchema), async (req, res) => {    
    const existingUser = await User.checkUserByEmail(req.body.email);
    if(existingUser){
        return res.status(422).json({
            errors: {
                email: { errors: ["email already in use"] }
            }
        });
    }

    const password_hash = await bcrypt.hash(req.body.password, 10);

    const currentUser = await User.register(req, password_hash);
console.log("Registered user:", currentUser);
    return res.status(201).json({
        message: "register successful, you can now login",
        data: {
            user: {
                _id: currentUser._id,
                username: currentUser.username,
                email: currentUser.email,
                image: currentUser.image,
                createdAt: currentUser.createdAt,
                updatedAt: new Date().toISOString()
            }
        }
    });
});

authRouter.post("/login", validateBody(loginSchema), async (req, res) => {
    const currentUser = await User.checkUserByEmail(req.body.email);
    if(!currentUser){
        return res.status(401).json({ error: "invalid email or password" });
    }

    // compare password
    const isValid = await bcrypt.compare(req.body.password, currentUser.password);
    if(!isValid){
        return res.status(401).json({ error: "invalid email or password" });
    }

    // create session
    req.session.regenerate((err) => {
        if (err) return next(err);
        req.session.userId = currentUser._id;
        
        // send res
        return res.status(200).json({
            message: "login successful",
            data: {
                user: {
                    _id: currentUser._id,
                    username: currentUser.username,
                    email: currentUser.email,
                    image: null,
                    createdAt: currentUser.createdAt,
                    updatedAt: new Date().toISOString()
                }
            }
        });
    });
});

authRouter.post("/logout", async (req, res) => {
    req.session.destroy((err) => {
        if (err) return next(err);

        res.clearCookie("movie_session");
        return res.status(200).json({ message: "logout successful" });
    });
});

authRouter.post("/forgot-password", validateBody(forgotPasswordSchema), async (req, res) => {
    const currentUser = await User.checkUserByEmail(req.body.email);
    if(!currentUser){
        return res.status(404).json({ error: "user not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    resetCode.set(req.body.email, { otp });

    await currentUser.setOtp(req.body.email, otp);

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: req.body.email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}`,
    });

    return res.status(200).json({
        message: "OTP sent to your email",
        data: {
            email: req.body.email,
            otp: otp
        }
    });
});

authRouter.post("/reset-password", validateBody(resetPasswordSchema), async (req, res) => {
    const currentUser = await User.checkUserByEmail(req.body.email);
    if(!currentUser){
        return res.status(404).json({ error: "user not found" });
    }

    const otpData = resetCode.get(req.body.email);
    if(!otpData || otpData.otp !== req.body.otp || Date.now() > currentUser.resetOtpExpires){
        return res.status(400).json({ error: "invalid or expired otp" });
    }

    const password_hash = await bcrypt.hash(req.body.new_password, 10);

    await currentUser.resetPassword(req.body.email, password_hash);

    resetCode.delete(req.body.email);
    
    return res.status(200).json({message: "password reset successful, you can now login"});
});

authRouter.get("/me", async (req, res) => {
    const currentUser = await User.me(req.session.userId);

    return res.status(200).json({
        data: { 
            user: {
                _id: currentUser._id,
                username: currentUser.username,
                email: currentUser.email,
                image: currentUser.image,
                updatedAt: new Date().toISOString()
            }
        }
    });
});