alter table public.questions
  add column if not exists parent_question_ref text,
  add column if not exists part_label text;
