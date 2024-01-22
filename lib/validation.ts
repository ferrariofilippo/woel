import * as z from "zod";
export const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  full_name: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(30, {
      message: "First name must not be longer than 30 characters.",
    }),
  // avatar_url: z.number(),
  // email: z.string().email(),
  school_name: z.number(),
  specialization_name: z.number(),
  // class: z.string(),
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export const passwordResetValidationSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Not a valid email"),
});
export const signInValidationSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Not a valid email"),
  password: z.string({ required_error: "Password is required" }).nonempty(),
});
export const signUpValidationSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .refine((password) => /\d/.test(password), {
      message: "Password must contain at least one number",
    })
    .refine((password) => /\W|_/.test(password), {
      message: "Password must contain at least one special character",
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((password) => password.length >= 8, {
      message: "Password must be at least 8 characters long",
    }),
});
export type SignInValidationSchema = z.infer<typeof signInValidationSchema>;
export type SignUpValidationSchema = z.infer<typeof signUpValidationSchema>;
export type PasswordResetValidationSchema = z.infer<
  typeof passwordResetValidationSchema
>;
export const updatePasswordFormSchema = z
  .object({
    password: z
      .string()
      .refine((password) => /\d/.test(password), {
        message: "Password must contain at least one number",
      })
      .refine((password) => /\W|_/.test(password), {
        message: "Password must contain at least one special character",
      })
      .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((password) => password.length >= 8, {
        message: "Password must be at least 8 characters long",
      }),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordFormSchema>;
