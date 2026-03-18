"use client";

type Activity = {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  details?: string | null;
  userId?: string | null;
  createdAt: string;
};

type ActivityClientProps = {
  canManage: boolean;
  activity: Activity[];
};

export default function Client({ canManage, activity }: ActivityClientProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Activity Log</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            See recent changes across FlowCRM entities.
          </p>
        </header>
      </div>
      <div className="bg-card border rounded-lg p-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-2">When</th>
              <th className="text-left py-2 px-2">Entity</th>
              <th className="text-left py-2 px-2">Action</th>
              <th className="text-left py-2 px-2">Details</th>
              <th className="text-left py-2 px-2">By</th>
            </tr>
          </thead>
          <tbody>
            {activity.length === 0 ? (
              <tr>
                <td className="text-center text-muted-foreground py-4" colSpan={5}>
                  No activity found.
                </td>
              </tr>
            ) : (
              activity.map((a) => (
                <tr key={a.id}>
                  <td className="py-2 px-2">{new Date(a.createdAt).toISOString().slice(0, 16).replace("T", " ")}</td>
                  <td className="py-2 px-2">{a.entityType}</td>
                  <td className="py-2 px-2">{a.action}</td>
                  <td className="py-2 px-2">{a.details || "-"}</td>
                  <td className="py-2 px-2">{a.userId || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}