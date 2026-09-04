import express from "express";
import { createDB } from "../db.js";

export const userRouter = express.Router();
const db = createDB();

userRouter.use(express.json());

// userRoute.use((req, res, next) => {
//   if (req.method == "GET" && req.url == "/users") {
//     res.json("hello");
//   }
//   next();
// });  

userRouter.get("/", async (req, res) => {
  // get all users from db
  const users = await db.getAll("users");

  // send as json
  res.json({
    data: users,
  });
});

userRouter.get("/:user_id", async (req, res) => {
  // get user by id from database
  const user = await db.getById("users", req.params.user_id);

  //send as json
  res.json({
    data: user,
  });
});

userRouter.post("/", async (req, res) => {
  // get data from req body
  const userData = req.body;

  // add to database
  await db.create("users", userData);

  // return response
  res.status(201).json({
    message: "user created successfully",
  });
});

userRouter.patch("/:user_id", async (req, res) => {
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
  const updateData = req.body;

  // update in database
  await db.update("users", id, updateData);

  const newUser = await db.getById("users", id);

  // return res
  return res.status(200).json({
    message: "user updated successfully",
    data: newUser,
  });
});

userRouter.delete("/:user_id", async (req, res) => {
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