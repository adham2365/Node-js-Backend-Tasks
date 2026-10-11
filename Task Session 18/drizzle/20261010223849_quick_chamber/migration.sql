CREATE TYPE "todo_status" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TABLE "todos" (
	"id" serial PRIMARY KEY,
	"title" varchar(255) NOT NULL UNIQUE,
	"body" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"done" "todo_status" DEFAULT 'no'::"todo_status"
);
