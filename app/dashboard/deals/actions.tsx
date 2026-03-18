"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { deals, activity, teamMembers, contacts } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

const CreateDealSchema = z.object({
  contactId: z.string().min(1, "Contact is required"),
  title: z.string().min(1, "Title is required"),
  status: z.string().min(1, "Status is required"),
  value: z.string().optional().nullable(),
  stage: z.string().min(1, "Stage is required"),
  note: z.string().optional().nullable(),
});

const UpdateDealSchema = CreateDealSchema.extend({
  id: z.string().min(1, "Deal ID required"),
});

const DeleteDealSchema = z.object({
  id: z.string().min(1, "Deal ID required"),
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

export async function createDealAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = CreateDealSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);
  if (!["owner", "admin"].includes(membership.role))
    return { error: { permission: "You do not have permission to add deals." } };

  // Check contact belongs to team
  const contact = await db
    .select()
    .from(contacts)
    .where(
      and(eq(contacts.id, parsed.data.contactId), eq(contacts.teamId, membership.teamId))
    )
    .limit(1);
  if (!contact.length)
    return { error: { contactId: "Selected contact not found." } };

  const result = await db
    .insert(deals)
    .values({
      ...parsed.data,
      teamId: membership.teamId,
    })
    .returning();

  // Log activity
  await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: "deal",
    entityId: result[0].id,
    action: "created",
    details: `Deal "${parsed.data.title}"`,
  });

  return { success: true, deal: result[0] };
}

export async function updateDealAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = UpdateDealSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);
  if (!["owner", "admin"].includes(membership.role))
    return { error: { permission: "You do not have permission to update deals." } };

  // Only allow update if deal belongs to team
  const target = await db
    .select()
    .from(deals)
    .where(
      and(
        eq(deals.id, parsed.data.id),
        eq(deals.teamId, membership.teamId)
      )
    )
    .limit(1);
  if (!target.length) return { error: { id: "Deal not found" } };

  await db
    .update(deals)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(deals.id, parsed.data.id));

  // Log activity
  await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: "deal",
    entityId: parsed.data.id,
    action: "updated",
    details: `Deal "${parsed.data.title}"`,
  });

  return { success: true };
}

export async function deleteDealAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = DeleteDealSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);
  if (!["owner", "admin"].includes(membership.role))
    return { error: { permission: "You do not have permission to delete deals." } };

  // Only allow delete if deal belongs to team
  const target = await db
    .select()
    .from(deals)
    .where(
      and(
        eq(deals.id, parsed.data.id),
        eq(deals.teamId, membership.teamId)
      )
    )
    .limit(1);
  if (!target.length) return { error: { id: "Deal not found" } };

  await db.delete(deals).where(eq(deals.id, parsed.data.id));

  // Log activity
  await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: "deal",
    entityId: parsed.data.id,
    action: "deleted",
    details: `Deal "${target[0].title}"`,
  });

  return { success: true };
}