create table if not exists public.upload_batches (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.profiles(id) on delete set null,
  total_files integer not null default 0,
  completed_files integer not null default 0,
  failed_files integer not null default 0,
  total_questions_extracted integer not null default 0,
  topic_id uuid references public.topics(id) on delete set null,
  subtopic_id uuid references public.subtopics(id) on delete set null,
  sub_subtopic_id uuid references public.sub_subtopics(id) on delete set null,
  status text not null default 'processing' check (status in ('processing','completed','partial','failed')),
  created_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.upload_batches enable row level security;
create policy "Admins full access on upload_batches" on public.upload_batches for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

alter table public.questions
  add column if not exists batch_id uuid references public.upload_batches(id) on delete set null;

create index if not exists idx_questions_batch_id on public.questions(batch_id);
