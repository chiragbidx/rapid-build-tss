## [2026-06-07] CRM Dashboard Features Bootstrap

- Added production-ready database tables for Contacts, Deals, Tasks, Notes, and Activity to support essential CRM flows (schema: `contacts`, `deals`, `tasks`, `notes`, `activity` in `lib/db/schema.ts`).
- Updated dashboard sidebar navigation to include Contacts, Deals, Tasks, Notes, and Activity sections.
- Added `/dashboard/contacts`, `/dashboard/deals`, `/dashboard/tasks`, `/dashboard/notes`, and `/dashboard/activity` route placeholders.
- Each CRM dashboard page includes a client-side interactive listing view, respecting permission flags. Server actions are stubbed for further CRUD development.
- Wire-up matches the production-ready segment split pattern (server `page.tsx`, client `client.tsx`, server `actions.tsx`), ready for full CRUD integration.
- No breaking changes to existing routes or authentication.
- Database migration is required to add new tables. Run the `init-db` GitHub Actions workflow after `npm run db:generate`.