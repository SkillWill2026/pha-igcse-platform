-- ============================================================
-- Migration 004: Cross-board question linking
-- Adds source_question_id to identify copied questions
-- ============================================================

alter table questions
  add column if not exists source_question_id uuid
    references questions(id) on delete set null;

create index if not exists idx_questions_source on questions(source_question_id);
