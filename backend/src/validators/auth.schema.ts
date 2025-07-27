import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(1),
    email: z.email("input a correct email format"),
    phoneNumber: z.string(),
    password: z
      .string()
      .min(6, "password should be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .transform(({ confirmPassword, ...rest }) => rest);

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  phoneNumber: z.string(),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
