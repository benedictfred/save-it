import z from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(1),
    email: z.email("Please put a valid email"),
    // phoneNumber: z
    //   .string()
    //   .min(10, "Phone number must be at least 10 digits")
    //   .max(11, "Phone number must be at most 11 digits")
    //   .regex(
    //     /^(0\d{10}|\d{10})$/,
    //     "Phone number must be 10 digits or 11 digits with leading 0"
    //   ),
    password: z
      .string()
      .min(6, "Password should be at least 6 characters long"),
    client: z.enum(["web", "mobile"]).default("web"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .transform(({ confirmPassword, ...rest }) => rest);

export const loginSchema = z.object({
  // phoneNumber: z
  //   .string()
  //   .min(10, "Phone number must be at least 10 digits")
  //   .max(11, "Phone number must be at most 11 digits")
  //   .transform((val) => {
  //     if (val.length === 10) return `+234${val}`;
  //     return `+234${val.slice(1)}`;
  //   }),
  email: z.email(),
  password: z.string(),
  client: z.enum(["web", "mobile"]).default("web"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password should be at least 6 characters long"),
  token: z.string(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "Password should be at least 6 characters long"),
});

export const pinSchema = z.object({
  pin: z.string().length(4, "Pin must be 4 characters"),
});

export const updatePinSchema = z.object({
  currentPin: z.string().min(1, "Current pin is required"),
  newPin: z.string().length(4, "Pin must be 4 characters"),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type SignupDto = z.infer<typeof signupSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
export type PinDto = z.infer<typeof pinSchema>;
export type UpdatePinDto = z.infer<typeof updatePinSchema>;
