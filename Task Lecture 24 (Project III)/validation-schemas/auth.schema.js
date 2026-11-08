import z from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(2, "username must contain 2 characters at least"),
    email: z.email().toLowerCase(),
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
  email: z.email().toLowerCase(),
  password: z.string().min(8, "password must contain 8 characters at least")
});

export const forgotPasswordSchema = z.object({
  email: z.email().toLowerCase()
});

export const resetPasswordSchema = z
  .object({
    email: z.email().toLowerCase(),
    otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d{6}$/, "OTP must be 6 digits"),
    new_password: z
      .string()
      .min(8, "password must contain 8 characters at least")
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "password must contain at least 1 capital letter, 1 small letter, 1 digit, and 1 special character"
      ),
    new_password_confirmation: z
      .string()
      .min(8, "password confirmation must contain 8 characters at least")
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "password confirmation must contain at least 1 capital letter, 1 small letter, 1 digit, and 1 special character"
      )
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    error: "password and password confirmation don't match",
    path: ["new_password_confirmation"]
  });