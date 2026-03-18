"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { notes, activity, teamMembers, contacts, deals as dealsTable } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

const CreateNoteSchema = z.object({
  body: z.string().min(1, "Body is required"),
  contactId: z.string().optional().nullable(),
  dealId: z.string().optional().nullable(),
});

const UpdateNoteSchema = CreateNoteSchema.extend({
  id: z.string().min(1, "Note ID required"),
});

const DeleteNoteSchema = z.object({
  id: z.string().min(1, "Note ID required"),
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

export async function createNoteAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = CreateNoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);
  if (!["owner", "admin"].includes(membership.role))
    return { error: { permission: "You do not have permission to add notes." } };

  // If contactId or dealId present, make sure they belong to team
  if (parsed.data.contactId) {
    const contact = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.id, parsed.data.contactId),
          eq(contacts.teamId, membership.teamId)
        )
      )
      .limit(1);
    if (!contact.length)
      return { error: { contactId: "Contact not found." } };
  }
  if (parsed.data.dealId) {
    const deal = await db
      .select()
      .from(dealsTable)
      .where(
        and(
          eq(dealsTable.id, parsed.data.dealId),
          eq(dealsTable.teamId, membership.teamId)
        )
      )
      .limit(1);
    if (!deal.length)
      return { error: { dealId: "Deal not found." } };
  }

  const result = await db
    .insert(notes)
    .values({
      ...parsed.data,
      teamId: membership.teamId,
      authorId: session.userId,
    })
    .returning();

  // Log activity
  await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: "note",
    entityId: result[0].id,
    action: "created",
    details: `Note created`,
  });

  return { success: true, note: result[0] };
}

export async function updateNoteAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = UpdateNoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);
  if (!["owner", "admin"].includes(membership.role))
    return { error: { permission: "You do not have permission to update notes." } };

  // Only allow update if note belongs to team
  const target = await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.id, parsed.data.id),
        eq(notes.teamId, membership.teamId)
      )
    )
    .limit(1);
  if (!target.length) return { error: { id: "Note not found" } };

  await db
    .update(notes)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(notes.id, parsed.data.id));

  // Log activity
  await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: "note",
    entityId: parsed.data.id,
    action: "updated",
    details: `Note updated`,
  });

  return { success: true };
}

export async function deleteNoteAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = DeleteNoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);
  if (!["owner", "admin"].includes(membership.role))
    return { error: { permission: "You do not have permission to delete notes." } };

  // Only allow delete if note belongs to team
  const target = await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.id, parsed.data.id),
        eq(notes.teamId, membership.teamId)
      )
    )
    .limit(1);
  if (!target.length) return { error: { id: "Note not found" } };

  await db.delete(notes).where(eq(notes.id, parsed.data.id));

  // Log activity
  await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: "note",
    entityId: parsed.data.id,
    action: "deleted",
    details: `Note deleted`,
  });

  return { success: true };
}