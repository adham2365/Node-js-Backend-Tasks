import z from "zod";

export const registerSchema = z.object({
    username: z.string("username is required"),
    email: z.email("email is required"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "password cofirmation must contain at least 1 capital letter, 1 small latter, 1 digit, and 1 special character"
    ),
    password_confirmation : z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "password cofirmation must contain at least 1 capital letter, 1 small latter, 1 digit, and 1 special character"
    )
}).refine((data) => data.password === data.password_confirmation, {
    error: "password and password confirmation don't match ",
    path: ["password_confirmation"],
  });