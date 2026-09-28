"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import * as z from "zod";
import { createSession, deleteSession } from "@/lib/session";
import { createUser, findUserByEmail } from "@/lib/users-csv";
import { LoginSchema, SignupSchema, type AuthFormState } from "@/lib/validation";

function flatten(error: z.ZodError) {
  return z.flattenError(error).fieldErrors as Record<string, string[]>;
}

export async function signup(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = {
    email: String(formData.get("email") ?? ""),
  };

  const parsed = SignupSchema.safeParse({
    ...values,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { errors: flatten(parsed.error), values };
  }

  const { email, password } = parsed.data;
  const name = email.split("@")[0] || "User";

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await createUser({
      name,
      email,
      passwordHash,
    });

    if ("error" in result) {
      return {
        errors: { email: ["An account with this email already exists."] },
        values,
      };
    }

    const { user } = result;
    await createSession({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    console.error("signup failed", error);
    return {
      message: "Could not create your account. Please try again.",
      values,
    };
  }

  redirect("/dashboard");
}

export async function login(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = { email: String(formData.get("email") ?? "") };

  const parsed = LoginSchema.safeParse({
    ...values,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: flatten(parsed.error), values };
  }

  const { email, password } = parsed.data;

  try {
    const user = await findUserByEmail(email);
    const valid = user && (await bcrypt.compare(password, user.passwordHash));

    if (!valid || !user) {
      return { message: "Invalid email or password.", values };
    }

    await createSession({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    console.error("login failed", error);
    return { message: "Could not sign you in. Please try again.", values };
  }

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
