import z from "zod";
  
export const registerSchema = z.object({
  username: z.string("username is required").min(2, "username must be at least 2 characters"),
  email: z.email("email is required"),
  password: z
    .string("password is required")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 digit and 1 special character"      
    ),
  password_confirmation: z.string("password confirmation is required"),
  role: z.enum(["customer", "merchant"])
}).refine(data => data.password === data.password_confirmation, {
  error: "password and password confirmation must match",
  path: ["password_confirmation"]
});