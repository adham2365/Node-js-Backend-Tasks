import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router } from "express"
import { validateBody } from "../middlewares/validateBody.js";
import {registerSchema} from "../schemas/auth/register.schema.js";
import {loginSchema} from "../schemas/auth/login.schema.js";
import { createDB } from "../db.js";

process.loadEnvFile();

export const authRouter = Router();
const db = createDB();

/**
 * @swagger /auth/login
 * POST /auth/login
 *
 * @description Authenticate a user with email and password.
 *
 * @body {string} email - User's email address
 * @body {string} password - User's password
 *
 * @success {200} { message: string }
 *   Returns a success message on successful login.
 *
 * @error {422} { errors: { [field]: { errors: string[] } } }
 *   Validation failed (missing or invalid fields).
 *   Example: { errors: { email: { errors: ["Required"] }, password: { errors: ["Required"] } } }
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
authRouter.post("/login", validateBody(loginSchema), async(req, res) => {
  // validate data ✅

  // check email ✅
  const users = await db.getAll("auth_users");
  const existingUser = users.find(u => u.email === req.body.email);
  if (!existingUser) {
    return res.status(422).json({
      error: "email or password are invalid"      
    });
  }
  
  // compare password ✅
  const isValid = await bcrypt.compare(req.body.password, existingUser.passwordHash);
  if (!isValid) {
    return res.status(422).json({
      error: "email or password are invalid"      
    });
  }

  // generate jwt token ✅
  const token = jwt.sign({
    username: existingUser.username,
    email: existingUser.email,
    id: existingUser.id
  }, process.env.JWT_SECRET);

  // create cookie ✅
  res.cookie("task_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3600 * 2000 // 2 hours
  })

  // TODO: implement actual authentication (bcrypt, JWT, etc.)
  res.status(200).json({ message: "login successful"});
});

/**
 * @swagger /auth/register
 * POST /auth/register
 *
 * @description Register a new user account.
 *
 * @body {string} username - Desired username
 * @body {string} email - User's email address
 * @body {string} password - User's password
 * @body {string} password_confirmation - Password confirmation (must match password)
 *
 * @success {201} { message: string }
 *   Returns a success message on successful registration.
 *
 * @error {422} { errors: { [field]: { errors: string[] } } }
 *   Validation failed (missing fields or passwords don't match).
 *   Example: { errors: { email: { errors: ["Required"] }, password_confirmation: { errors: ["Passwords do not match"] } } }
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
authRouter.post("/register", validateBody(registerSchema), async(req, res) => {
  // validate data ✅
  
  // password hash ✅
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // check if email unique ✅
  const users = await db.getAll("auth_users");
  const existingUser = users.find(u => u.email === req.body.email);
  if (existingUser) {
    return res.status(422).json({
      error: "email already in use"      
    });
  }

  // add user to db ✅
  await db.create("auth_users", {
      email: req.body.email,
      username: req.body.username,
      passwordHash: hashedPassword
    });

  // TODO: implement actual registration (hash password, save user, etc.)
  res.status(201).json({ message: "register successful"});
});

/**
 * @swagger /auth/logout
 * POST /auth/logout
 *
 * @description Log out the current user (invalidate session/token).
 *
 * @success {200} { message: string }
 *   Returns a success message on successful logout.
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
authRouter.post("/logout", (req, res) => {
  res.clearCookie("task_token");
  // TODO: implement actual logout (destroy session, invalidate token, etc.)
  res.status(200).json({ message: "logout successful" });
});
