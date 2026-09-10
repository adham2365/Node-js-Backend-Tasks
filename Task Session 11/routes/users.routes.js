import express from "express";
import { createDB } from "../db.js";
import { validateBody } from "../middleware/validateBody.js";
import { userSchema } from "../schema/user.schema.js";

export const usersRouter = express.Router();

const db = createDB();

usersRouter.use((req, res, next) => {
  console.log("I am inside user router");
  next();
});

usersRouter.get("/", async (req, res) => {
  // get all users from db
  const users = await db.getAll("users");

  // send as json
  res.json({
    data: users,
  });
});

usersRouter.get("/:user_id", async (req, res) => {
  // get user by id from database
  const user = await db.getById("users", req.params.user_id);

  //send as json
  res.json({
    data: user,
  });
});

usersRouter.post("/", validateBody(userSchema), async (req, res) => {
  // get data from req body
  await db.create("users", req.body);

  // return response
  return res.status(201).json({
    message: "user created successfully",
  });

  // if (!nameResult.success) {
  //   return res.status(422).json({
  //     error: "name is required",
  //   });
  // }

  // /// data type
  // if (!validateString(userData.name)) {
  //   return res.status(422).json({
  //     error: "name should be a string",
  //   });
  // }

  // if (userData.name.length < 2) {
  //   return res.status(422).json({
  //     error: "name should be at least 2 characters",
  //   });
  // }

  // if (!checkRequired(age)) {
  //   return res.status(422).json({
  //     error: "age is required",
  //   });
  // }

  // if (typeof userData.age !== "number") {
  //   return res.status(422).json({
  //     error: "age should be a number",
  //   });
  // }

  // if (userData.age < 18) {
  //   return res.status(422).json({
  //     error: "age should be at least 18",
  //   });
  // }

  // if (!checkRequired(userData.email)) {
  //   return res.status(422).json({
  //     error: "email is required",
  //   });
  // }

  // if (typeof userData.email !== "string") {
  //   return res.status(422).json({
  //     error: "email should be a string",
  //   });
  // }

  // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // if (!emailRegex.test(userData.email)) {
  //   return res.status(422).json({
  //     error: "invalid email format",
  //   });
  // }

  // add to database
});

/// /users?search=eyad


usersRouter.patch(
  "/:user_id",
  validateBody(userSchema.partial()),
  async (req, res) => {
    // get id from params
    const id = req.params.user_id;

    // check database
    const user = await db.getById("users", id);

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    // get data from body
    // update in database
    await db.update("users", id, req.body);
    const newUser = await db.getById("users", id);

    // return res
    return res.status(200).json({
      message: "user updated successfully",
      data: newUser,
    });
  },
);

usersRouter.delete("/:user_id", async (req, res) => {
  // get id from params
  const id = req.params.user_id;

  // check if in database
  const user = await db.getById("users", id);

  // if present delete -> return res
  if (user) {
    await db.delete("users", id);
    return res.status(204).json({
      message: "user deleted successfully",
    });
  } else {
    // if not present -> 404
    return res.status(404).json({
      message: "user not found",
    });
  }
});
