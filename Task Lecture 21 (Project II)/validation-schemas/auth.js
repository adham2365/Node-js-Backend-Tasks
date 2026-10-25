import z from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(2, "username must contain 2 characters at least"),
    email: z.email(),
    password: z
      .string()
      .min(8, "password must contain 8 characters at least")
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "password must contain at least 1 capital letter, 1 small letter, 1 digit, and 1 special character"
      ),
    password_confirmation: z
      .string()
      .min(8, "password confirmation must contain 8 characters at least")
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "password confirmation must contain at least 1 capital letter, 1 small letter, 1 digit, and 1 special character"
      )
  })
  .refine((data) => data.password === data.password_confirmation, {
    error: "password and password confirmation don't match",
    path: ["password_confirmation"]
  });

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "password must contain 8 characters at least")
});