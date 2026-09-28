"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as z from "zod";
import { db, schema } from "@/db";
import { createSession, deleteSession } from "@/lib/session";
import { LoginSchema, SignupSchema, type AuthFormState } from "@/lib/validation";

function flatten(error: z.ZodError) {
  return z.flattenError(error).fieldErrors as Record<string, string[]>;
}

export async function signup(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
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

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  try {
    const existing = await db.query.users.findFirst({
      where: eq(schema.users.email, normalizedEmail),
      columns: { id: true },
    });

    if (existing) {
      return {
        errors: { email: ["An account with this email already exists."] },
        values,
      };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [user] = await db
      .insert(schema.users)
      .values({ name, email: normalizedEmail, passwordHash })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
      });

    await createSession(user);
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
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email.toLowerCase()),
    });

    const valid = user && (await bcrypt.compare(password, user.passwordHash));

    if (!valid) {
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
