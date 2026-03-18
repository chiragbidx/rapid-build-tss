"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createAuthSession, getAuthSession } from "@/lib/auth/session";
import { generateAuthToken } from "@/lib/auth/tokens";
import { db } from "@/lib/db/client";
import { teams, teamMembers, users } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/sendgrid";

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message: string;
  _devUrl?: string;
};

const signInSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const signUpSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function getSafeRedirect(formData: FormData): string {
  const raw = formData.get("redirectTo");
  if (typeof raw === "string" && raw.startsWith("/")) return raw;
  return "/dashboard";
}

export async function signInWithPassword(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const email = parsed.data.email.toLowerCase();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    return { status: "error", message: "Invalid email or password." };
  }

  const isValidPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!isValidPassword) {
    return { status: "error", message: "Invalid email or password." };
  }

  await createAuthSession(user.id, user.email);
  redirect(getSafeRedirect(formData));
}

export async function signUpWithPassword(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const email = parsed.data.email.toLowerCase();
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    return {
      status: "error",
      message: "An account with this email already exists.",
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const [newUser] = await db.insert(users).values({
    email,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    passwordHash,
  }).returning({ id: users.id });

  const redirectTo = getSafeRedirect(formData);
  const isInviteFlow = redirectTo.startsWith("/invite/");

  if (!isInviteFlow) {
    const teamName = `${parsed.data.firstName}'s Team`;
    const [newTeam] = await db.insert(teams).values({ name: teamName }).returning({ id: teams.id });
    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      userId: newUser.id,
      role: "owner",
    });
  }

  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
  const verifyToken = await generateAuthToken(newUser.id, "email_verification");
  const verifyUrl = `${baseUrl}/auth/verify-email/${verifyToken}`;
  console.log(`[VerifyEmail] ${email} → ${verifyUrl}`);

  await sendEmail(
    email,
    "Verify your email address for FlowCRM",
    `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Welcome to FlowCRM!</h2>
      <p>Please verify your email to activate your FlowCRM account and start building your CRM workspace.</p>
      <p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background: #6715C2; color: #fff; text-decoration: none; border-radius: 6px;">
          Verify Email
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">This link expires in 24 hours.<br>If you have any questions, contact Chirag Dodiya at chirag@bidx.ai</p>
    </div>
    `
  );

  await createAuthSession(newUser.id, email);
  redirect(getSafeRedirect(formData));
}

export async function resendVerificationEmailAction(
  _prevState: AuthActionState
): Promise<AuthActionState> {
  const session = await getAuthSession();
  if (!session) {
    return { status: "error", message: "You must be signed in." };
  }

  const [user] = await db
    .select({ id: users.id, email: users.email, emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user) {
    return { status: "error", message: "User not found." };
  }

  if (user.emailVerified) {
    return { status: "success", message: "Your email is already verified." };
  }

  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
  const token = await generateAuthToken(user.id, "email_verification");
  const verifyUrl = `${baseUrl}/auth/verify-email/${token}`;
  console.log(`[VerifyEmail] ${user.email} → ${verifyUrl}`);

  const result = await sendEmail(
    user.email,
    "Verify your email address for FlowCRM",
    `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Verify your FlowCRM email</h2>
      <p>Click the button below to verify your FlowCRM account email address.</p>
      <p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background: #6715C2; color: #fff; text-decoration: none; border-radius: 6px;">
          Verify Email
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">This link expires in 24 hours.<br>If you have questions, contact Chirag Dodiya at chirag@bidx.ai.</p>
    </div>
    `
  );

  if (!result.success) {
    return {
      status: "success",
      message: "Verification email sent. Check your inbox (or browser console for the link).",
      _devUrl: verifyUrl,
    };
  }

  return { status: "success", message: "Verification email sent. Check your inbox.", _devUrl: verifyUrl };
}