import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import Client from "./client";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { activity, teamMembers } from "@/lib/db/schema";

export default async function ActivityPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!membership) {
    return <Client canManage={false} activity={[]} />;
  }

  const records = await db
    .select()
    .from(activity)
    .where(eq(activity.teamId, membership.teamId));

  return (
    <Client
      canManage={membership.role === "owner" || membership.role === "admin"}
      activity={records}
    />
  );
}