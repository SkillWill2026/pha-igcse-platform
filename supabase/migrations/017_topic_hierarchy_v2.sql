-- ============================================================
-- 3-Level Topic Hierarchy: Topics → Subtopics → Sub-subtopics
-- ============================================================

-- ─────────────────────────────────────────────
-- sub_subtopics table
-- ─────────────────────────────────────────────
create table if not exists sub_subtopics (
  id            uuid primary key default gen_random_uuid(),
  subtopic_id   uuid not null references subtopics(id) on delete cascade,
  ref           text not null,                         -- e.g. "1.1.1"
  name          text not null,
  e_only        boolean not null default false,        -- E-only topics
  created_at    timestamptz not null default now()
);

-- Unique constraint on (subtopic_id, ref) to prevent duplicates
alter table sub_subtopics add constraint unique_subtopic_ref unique (subtopic_id, ref);

-- Index for efficient querying
create index if not exists idx_sub_subtopics_subtopic on sub_subtopics(subtopic_id);

-- ─────────────────────────────────────────────
-- Add sub_subtopic_id to questions table
-- ─────────────────────────────────────────────
alter table questions add column sub_subtopic_id uuid references sub_subtopics(id) on delete set null;
create index if not exists idx_questions_sub_subtopic on questions(sub_subtopic_id);

-- ─────────────────────────────────────────────
-- "Mix" entries for topic/subtopic selection
-- ─────────────────────────────────────────────
-- These are inserted as special topics/subtopics that let users select mixed content
-- "Mix Topics" → subtopic "Mix Topics" within a special "Mix Topics" topic
-- "Mix Subtopics" → sub-subtopic allowing mixed subtopic selection

-- Check if "Mix Topics" topic exists (UUID will be deterministic for consistency)
insert into topics (id, ref, name, subtopic_count, question_target, completion_date)
values (
  '00000000-0000-4000-8000-000000000001'::uuid,
  'MIX',
  'Mix Topics',
  1,
  0,
  null
)
on conflict (ref) do nothing;

-- Create "Mix Topics" subtopic under "Mix Topics" topic
insert into subtopics (id, topic_id, ref, name, sprint_week, due_date, question_target)
select
  '00000000-0000-4000-8000-000000000002'::uuid,
  '00000000-0000-4000-8000-000000000001'::uuid,
  'MIX.MIX',
  'Mix Topics',
  1,
  '2026-12-31'::date,
  0
on conflict (ref) do nothing;

-- Create "Mix Subtopics" sub-subtopic for mixed subtopic selection
insert into sub_subtopics (id, subtopic_id, ref, name, e_only)
values (
  '00000000-0000-4000-8000-000000000003'::uuid,
  '00000000-0000-4000-8000-000000000002'::uuid,
  'MIX.MIX.MIX',
  'Mix Subtopics',
  false
)
on conflict (subtopic_id, ref) do nothing;
