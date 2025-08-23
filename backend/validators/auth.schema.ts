import z from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(1),
    email: z.email("Please put a valid email"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(11, "Phone number must be at most 11 digits")
      .regex(
        /^(0\d{10}|\d{10})$/,
        "Phone number must be 10 digits or 11 digits with leading 0"
      ),
    password: z
      .string()
      .min(6, "Password should be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .transform(({ confirmPassword, phoneNumber, ...rest }) => {
    const formattedPhone = phoneNumber.startsWith("0")
      ? `+234${phoneNumber.slice(1)}`
      : `+234${phoneNumber}`;

    const accountNumber = phoneNumber.startsWith("0")
      ? phoneNumber.slice(1)
      : phoneNumber;

    return {
      ...rest,
      phoneNumber: formattedPhone,
      accountNumber,
    };
  });
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(11, "Phone number must be at most 11 digits")
    .transform((val) => {
      if (val.length === 10) return `+234${val}`;
      return `+234${val.slice(1)}`;
    }),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const resetPasswordSchema = z
  .object({
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

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
