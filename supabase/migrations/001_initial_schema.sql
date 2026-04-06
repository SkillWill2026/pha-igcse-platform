-- ============================================================
-- PHA IGCSE Platform — Initial Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- exam_boards
-- ─────────────────────────────────────────────
create table if not exists exam_boards (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- topics  (C1 – C9)
-- ─────────────────────────────────────────────
create table if not exists topics (
  id                uuid primary key default gen_random_uuid(),
  ref               text not null unique,          -- e.g. "C1"
  name              text not null,
  subtopic_count    int  not null default 0,
  question_target   int  not null default 0,
  completion_date   date
);

-- ─────────────────────────────────────────────
-- subtopics  (1.1 – 9.5)
-- ─────────────────────────────────────────────
create table if not exists subtopics (
  id               uuid primary key default gen_random_uuid(),
  topic_id         uuid not null references topics(id) on delete cascade,
  ref              text not null unique,            -- e.g. "1.1"
  name             text not null,
  sprint_week      int  not null check (sprint_week between 1 and 14),
  due_date         date not null,
  question_target  int  not null check (question_target in (156, 157))
);

-- ─────────────────────────────────────────────
-- questions
-- ─────────────────────────────────────────────
create type question_type_enum as enum (
  'mcq', 'short_answer', 'structured', 'extended'
);

create type content_status_enum as enum (
  'draft', 'approved', 'rejected'
);

create table if not exists questions (
  id              uuid primary key default gen_random_uuid(),
  exam_board_id   uuid not null references exam_boards(id) on delete restrict,
  topic_id        uuid not null references topics(id)      on delete restrict,
  subtopic_id     uuid not null references subtopics(id)   on delete restrict,
  content_text    text not null,
  image_url       text,
  difficulty      int  not null check (difficulty between 1 and 5),
  question_type   question_type_enum  not null,
  marks           int  not null check (marks > 0),
  status          content_status_enum not null default 'draft',
  ai_extracted    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- answers
-- ─────────────────────────────────────────────
create table if not exists answers (
  id               uuid primary key default gen_random_uuid(),
  question_id      uuid not null unique references questions(id) on delete cascade,
  content_text     text not null,
  step_by_step     text[] not null default '{}',
  mark_scheme      text not null default '',
  confidence_score float check (confidence_score between 0 and 1),
  status           content_status_enum not null default 'draft',
  ai_generated     boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- updated_at trigger helper
-- ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger questions_updated_at
  before update on questions
  for each row execute function set_updated_at();

create trigger answers_updated_at
  before update on answers
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────
create index if not exists idx_questions_exam_board  on questions(exam_board_id);
create index if not exists idx_questions_topic       on questions(topic_id);
create index if not exists idx_questions_subtopic    on questions(subtopic_id);
create index if not exists idx_questions_status      on questions(status);
create index if not exists idx_subtopics_topic       on subtopics(topic_id);
create index if not exists idx_subtopics_sprint_week on subtopics(sprint_week);
