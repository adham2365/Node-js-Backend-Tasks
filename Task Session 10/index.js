import express from "express";
import { authorRouter } from "./routes/authors.route.js";
import { userRouter } from "./routes/users.route.js";

const app = express();

app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});

app.use("/authors", authorRouter);
app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
