"use client";

type Note = {
  id: string;
  authorId?: string | null;
  contactId?: string | null;
  dealId?: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
};

type NotesClientProps = {
  canManage: boolean;
  notes: Note[];
};

export default function Client({ canManage, notes }: NotesClientProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Jot down context or information for contacts and deals.
          </p>
        </header>
        {canManage && (
          <button
            disabled
            className="rounded px-4 py-2 bg-primary/80 text-background cursor-not-allowed opacity-60"
          >
            Add Note
          </button>
        )}
      </div>
      <div className="bg-card border rounded-lg p-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-2">Note</th>
              <th className="text-left py-2 px-2">Author</th>
              <th className="text-left py-2 px-2">Created</th>
              <th className="text-left py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {notes.length === 0 ? (
              <tr>
                <td className="text-center text-muted-foreground py-4" colSpan={4}>
                  No notes found.
                </td>
              </tr>
            ) : (
              notes.map((n) => (
                <tr key={n.id}>
                  <td className="py-2 px-2 max-w-[440px] truncate">{n.body}</td>
                  <td className="py-2 px-2">{n.authorId || "-"}</td>
                  <td className="py-2 px-2">
                    {new Date(n.createdAt).toISOString().slice(0, 10)}
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