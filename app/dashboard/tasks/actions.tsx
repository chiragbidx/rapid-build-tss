"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { tasks, activity, teamMembers, users, contacts, deals as dealsTable } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  status: z.string().min(1, "Status is required"),
  assignedToUserId: z.string().optional().nullable(),
  contactId: z.string().optional().nullable(),
  dealId: z.string().optional().nullable(),
});

const UpdateTaskSchema = CreateTaskSchema.extend({
  id: z.string().min(1, "Task ID required"),
});

const DeleteTaskSchema = z.object({
  id: z.string().min(1, "Task ID required"),
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

export async function createTaskAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = CreateTaskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);
  if (!["owner", "admin"].includes(membership.role))
    return { error: { permission: "You do not have permission to add tasks." } };

  // Optional cross-checks: assigned user, contact, deal belong to team if provided
  if (parsed.data.assignedToUserId) {
    const assignee = await db
      .select()
      .from(users)
      .where(eq(users.id, parsed.data.assignedToUserId))
      .limit(1);
    if (!assignee.length)
      return { error: { assignedToUserId: "Assigned user not found." } };
  }
  if (parsed.data.contactId) {
    const contact = await db
      .select()
      .from(contacts)
      .where(
        and(eq(contacts.id, parsed.data.contactId), eq(contacts.teamId, membership.teamId))
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
        and(eq(dealsTable.id, parsed.data.dealId), eq(dealsTable.teamId, membership.teamId))
      )
      .limit(1);
    if (!deal.length)
      return { error: { dealId: "Deal not found." } };
  }

  const result = await db
    .insert(tasks)
    .values({
      ...parsed.data,
      teamId: membership.teamId,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
    })
    .returning();

  // Log activity
  await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: "task",
    entityId: result[0].id,
    action: "created",
    details: `Task "${parsed.data.title}"`,
  });

  return { success: true, task: result[0] };
}

export async function updateTaskAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = UpdateTaskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);
  if (!["owner", "admin"].includes(membership.role))
    return { error: { permission: "You do not have permission to update tasks." } };

  const target = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.id, parsed.data.id),
        eq(tasks.teamId, membership.teamId)
      )
    )
    .limit(1);
  if (!target.length) return { error: { id: "Task not found" } };

  await db
    .update(tasks)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
    })
    .where(eq(tasks.id, parsed.data.id));

  // Log activity
  await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: "task",
    entityId: parsed.data.id,
    action: "updated",
    details: `Task "${parsed.data.title}"`,
  });

  return { success: true };
}

export async function deleteTaskAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = DeleteTaskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);
  if (!["owner", "admin"].includes(membership.role))
    return { error: { permission: "You do not have permission to delete tasks." } };

  // Only allow delete if task belongs to team
  const target = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.id, parsed.data.id),
        eq(tasks.teamId, membership.teamId)
      )
    )
    .limit(1);
  if (!target.length) return { error: { id: "Task not found" } };

  await db.delete(tasks).where(eq(tasks.id, parsed.data.id));

  // Log activity
  await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: "task",
    entityId: parsed.data.id,
    action: "deleted",
    details: `Task "${target[0].title}"`,
  });

  return { success: true };
}