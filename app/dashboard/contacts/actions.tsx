"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { contacts, activity, teamMembers } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

const CreateContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
});

const UpdateContactSchema = CreateContactSchema.extend({
  id: z.string().min(1, "Contact ID required"),
});

const DeleteContactSchema = z.object({
  id: z.string().min(1, "Contact ID required"),
});

async function requireTeamMembership(userId: string) {
  const member = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);

  if (!member.length) throw new Error("Not a team member");
  return member[0];
}

export async function createContactAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = CreateContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);
  if (!["owner", "admin"].includes(membership.role))
    return { error: { permission: "You do not have permission to add contacts." } };

  // Prevent duplicate emails in team
  const existing = await db
    .select()
    .from(contacts)
    .where(
      and(
        eq(contacts.teamId, membership.teamId),
        eq(contacts.email, parsed.data.email)
      )
    )
    .limit(1);

  if (existing.length)
    return { error: { email: "A contact with this email already exists." } };

  const result = await db
    .insert(contacts)
    .values({
      ...parsed.data,
      teamId: membership.teamId,
    })
    .returning();

  // Log activity
  await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: "contact",
    entityId: result[0].id,
    action: "created",
    details: `Contact ${parsed.data.firstName} ${parsed.data.lastName}`,
  });

  return { success: true, contact: result[0] };
}

export async function updateContactAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = UpdateContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);
  if (!["owner", "admin"].includes(membership.role))
    return { error: { permission: "You do not have permission to update contacts." } };

  // Only allow update if contact belongs to team
  const target = await db
    .select()
    .from(contacts)
    .where(
      and(
        eq(contacts.id, parsed.data.id),
        eq(contacts.teamId, membership.teamId)
      )
    )
    .limit(1);
  if (!target.length) return { error: { id: "Contact not found" } };

  await db
    .update(contacts)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(contacts.id, parsed.data.id));

  // Log activity
  await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: "contact",
    entityId: parsed.data.id,
    action: "updated",
    details: `Contact ${parsed.data.firstName} ${parsed.data.lastName}`,
  });

  return { success: true };
}

export async function deleteContactAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = DeleteContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);
  if (!["owner", "admin"].includes(membership.role))
    return { error: { permission: "You do not have permission to delete contacts." } };

  // Only allow delete if contact belongs to team
  const target = await db
    .select()
    .from(contacts)
    .where(
      and(
        eq(contacts.id, parsed.data.id),
        eq(contacts.teamId, membership.teamId)
      )
    )
    .limit(1);
  if (!target.length) return { error: { id: "Contact not found" } };

  await db.delete(contacts).where(eq(contacts.id, parsed.data.id));

  // Log activity
  await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: "contact",
    entityId: parsed.data.id,
    action: "deleted",
    details: `Contact ${target[0].firstName} ${target[0].lastName}`,
  });

  return { success: true };
}