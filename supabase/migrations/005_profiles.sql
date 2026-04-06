-- ============================================================
-- Migration 005: User profiles + roles
-- ============================================================

create type user_role_enum as enum ('admin', 'tutor');

create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '',
  role       user_role_enum not null default 'tutor',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Authenticated users can read their own profile
create policy "Users can read own profile" on profiles
  for select to authenticated
  using (auth.uid() = id);

-- Service role bypasses RLS automatically (used for admin operations)
