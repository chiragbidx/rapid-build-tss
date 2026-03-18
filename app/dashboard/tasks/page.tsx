import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import Client from "./client";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { tasks, teamMembers } from "@/lib/db/schema";

export default async function TasksPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!membership) {
    return <Client canManage={false} tasks={[]} />;
  }

  const records = await db
    .select()
    .from(tasks)
    .where(eq(tasks.teamId, membership.teamId));

  return (
    <Client
      canManage={membership.role === "owner" || membership.role === "admin"}
      tasks={records}
    />
  );
}