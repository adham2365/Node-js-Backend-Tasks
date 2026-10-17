import { pgTable, varchar, serial, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const todo_status = pgEnum("todo_status", ["yes", "no"]);

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: varchar("title", {length: 255}).notNull().unique(),
  body: varchar("body", {length: 255}).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  done: todo_status().default("no"),
});