-- Add Contacts table
create table if not exists "contacts" (
  "id" text primary key not null default gen_random_uuid(),
  "team_id" text not null references "teams"("id") on delete cascade,
  "first_name" text not null,
  "last_name" text not null,
  "email" text not null,
  "phone" text,
  "company" text,
  "title" text,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

-- Add Deals table
create table if not exists "deals" (
  "id" text primary key not null default gen_random_uuid(),
  "team_id" text not null references "teams"("id") on delete cascade,
  "contact_id" text not null references "contacts"("id") on delete cascade,
  "title" text not null,
  "status" text not null,
  "value" text,
  "stage" text not null,
  "note" text,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

-- Add Tasks table
create table if not exists "tasks" (
  "id" text primary key not null default gen_random_uuid(),
  "team_id" text not null references "teams"("id") on delete cascade,
  "assigned_to_user_id" text references "users"("id") on delete set null,
  "contact_id" text references "contacts"("id") on delete set null,
  "deal_id" text references "deals"("id") on delete set null,
  "title" text not null,
  "description" text,
  "due_date" timestamptz,
  "status" text not null default 'pending',
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

-- Add Notes table
create table if not exists "notes" (
  "id" text primary key not null default gen_random_uuid(),
  "team_id" text not null references "teams"("id") on delete cascade,
  "author_id" text references "users"("id") on delete set null,
  "contact_id" text references "contacts"("id") on delete set null,
  "deal_id" text references "deals"("id") on delete set null,
  "body" text not null,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

-- Add Activity table
create table if not exists "activity" (
  "id" text primary key not null default gen_random_uuid(),
  "team_id" text not null references "teams"("id") on delete cascade,
  "user_id" text references "users"("id") on delete set null,
  "entity_type" text not null,
  "entity_id" text not null,
  "action" text not null,
  "details" text,
  "created_at" timestamptz not null default now()
);