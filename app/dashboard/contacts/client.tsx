"use client";

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  title?: string | null;
  createdAt: string;
  updatedAt: string;
};

type ContactsClientProps = {
  canManage: boolean;
  contacts: Contact[];
};

export default function Client({ canManage, contacts }: ContactsClientProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage people you work with.
          </p>
        </header>
        {canManage && (
          <button
            disabled
            className="rounded px-4 py-2 bg-primary/80 text-background cursor-not-allowed opacity-60"
          >
            Add Contact
          </button>
        )}
      </div>
      <div className="bg-card border rounded-lg p-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-2">Name</th>
              <th className="text-left py-2 px-2">Email</th>
              <th className="text-left py-2 px-2">Phone</th>
              <th className="text-left py-2 px-2">Company</th>
              <th className="text-left py-2 px-2">Title</th>
              <th className="text-left py-2 px-2">Created</th>
              <th className="text-left py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td className="text-center text-muted-foreground py-4" colSpan={7}>
                  No contacts found.
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id}>
                  <td className="py-2 px-2">{c.firstName} {c.lastName}</td>
                  <td className="py-2 px-2">{c.email}</td>
                  <td className="py-2 px-2">{c.phone || "-"}</td>
                  <td className="py-2 px-2">{c.company || "-"}</td>
                  <td className="py-2 px-2">{c.title || "-"}</td>
                  <td className="py-2 px-2">
                    {new Date(c.createdAt).toISOString().slice(0, 10)}
                  </td>
                  <td className="py-2 px-2">
                    {/* Actions - coming soon (edit/delete) */}
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