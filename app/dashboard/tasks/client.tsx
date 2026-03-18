"use client";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type TasksClientProps = {
  canManage: boolean;
  tasks: Task[];
};

export default function Client({ canManage, tasks }: TasksClientProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Assign and track reminders / action items.
          </p>
        </header>
        {canManage && (
          <button
            disabled
            className="rounded px-4 py-2 bg-primary/80 text-background cursor-not-allowed opacity-60"
          >
            Add Task
          </button>
        )}
      </div>
      <div className="bg-card border rounded-lg p-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-2">Title</th>
              <th className="text-left py-2 px-2">Status</th>
              <th className="text-left py-2 px-2">Due</th>
              <th className="text-left py-2 px-2">Created</th>
              <th className="text-left py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td className="text-center text-muted-foreground py-4" colSpan={5}>
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr key={t.id}>
                  <td className="py-2 px-2">{t.title}</td>
                  <td className="py-2 px-2">{t.status}</td>
                  <td className="py-2 px-2">{t.dueDate ? new Date(t.dueDate).toISOString().slice(0, 10) : "-"}</td>
                  <td className="py-2 px-2">
                    {new Date(t.createdAt).toISOString().slice(0, 10)}
                  </td>
                  <td className="py-2 px-2">
                    {/* Actions (edit/delete) coming soon */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}