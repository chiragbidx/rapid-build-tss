"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { activity, teamMembers } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

// Activity is logged by other CRUD server actions, but allow direct logging if needed.
const LogActivitySchema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  action: z.string().min(1),
  details: z.string().optional().nullable(),
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

export async function logActivityAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const parsed = LogActivitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const membership = await requireTeamMembership(session.userId);

  // Log activity directly (for custom or external logs)
  const result = await db.insert(activity).values({
    teamId: membership.teamId,
    userId: session.userId,
    entityType: parsed.data.entityType,
    entityId: parsed.data.entityId,
    action: parsed.data.action,
    details: parsed.data.details ?? undefined,
  }).returning();

  return { success: true, activity: result[0] };
}