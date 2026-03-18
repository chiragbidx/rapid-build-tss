"use client";

type Deal = {
  id: string;
  title: string;
  status: string;
  value?: string | null;
  stage: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
};

type DealsClientProps = {
  canManage: boolean;
  deals: Deal[];
};

export default function Client({ canManage, deals }: DealsClientProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Deals (Opportunities)</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage sales stages and pipelines.
          </p>
        </header>
        {canManage && (
          <button
            disabled
            className="rounded px-4 py-2 bg-primary/80 text-background cursor-not-allowed opacity-60"
          >
            Add Deal
          </button>
        )}
      </div>
      <div className="bg-card border rounded-lg p-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-2">Title</th>
              <th className="text-left py-2 px-2">Stage</th>
              <th className="text-left py-2 px-2">Status</th>
              <th className="text-left py-2 px-2">Value</th>
              <th className="text-left py-2 px-2">Created</th>
              <th className="text-left py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {deals.length === 0 ? (
              <tr>
                <td className="text-center text-muted-foreground py-4" colSpan={6}>
                  No deals found.
                </td>
              </tr>
            ) : (
              deals.map((d) => (
                <tr key={d.id}>
                  <td className="py-2 px-2">{d.title}</td>
                  <td className="py-2 px-2">{d.stage}</td>
                  <td className="py-2 px-2">{d.status}</td>
                  <td className="py-2 px-2">{d.value || "-"}</td>
                  <td className="py-2 px-2">
                    {new Date(d.createdAt).toISOString().slice(0, 10)}
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