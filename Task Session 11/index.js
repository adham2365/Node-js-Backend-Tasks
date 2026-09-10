import express from "express";
import { booksRouter } from "./routes/books.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { authorRouter } from "./routes/authors.routes.js";
import { createDB } from "./db.js";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});

app.use(logger);

app.use(createLogger("info"));

app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/authors", authorRouter);

app.use((req, res, next) => {
  const error = new Error();
  error.message = "Path not found";
  error.status = 404;  
  next(error);
});

app.use(async (err, req, res, next) => {
  const db = createDB();
  
  await db.create("errors", {
    message: err.message,
    stack: err.stack
  });
  next(err);
});

app.use((err, req, res, next) => {
  // console.log("err", err);
  res.status(err.status || 500).json( err.message || {error: "something went wrong" });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

function logger(req, res, next) {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
}

function createLogger(type) {
  return (req, res, next) => {
    console.log(type, new Date().toLocaleString(), req.method, req.url);
    next();
  };
}
