import * as z from "zod";

export const SignupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { error: "Name must be at least 2 characters." })
      .max(120, { error: "Name is too long." }),
    email: z.email({ error: "Please enter a valid email address." }).trim(),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters." })
      .max(128, { error: "Password is too long." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).trim(),
  password: z.string().min(1, { error: "Password is required." }),
});

export type FieldErrors = Record<string, string[] | undefined>;

export type AuthFormState =
  | {
      errors?: FieldErrors;
      message?: string;
      /** Non-sensitive submitted values, echoed back so the form keeps them after a failed submit. */
      values?: { name?: string; email?: string };
    }
  | undefined;
