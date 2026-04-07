-- NOTE: Before running this migration, manually create a Storage bucket in
-- the Supabase dashboard with the following settings:
--   Name:              question-images
--   Public bucket:     false
--   Allowed MIME types: image/jpeg, image/png, image/gif, image/webp, image/svg+xml

create table if not exists public.question_images (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  storage_path text not null,
  public_url text,
  image_type text not null default 'question' check (image_type in ('question','answer','diagram')),
  caption text,
  sort_order integer not null default 0,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.question_images enable row level security;

create policy "Admins full access on question_images"
  on public.question_images for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Tutors read question_images"
  on public.question_images for select
  using (auth.uid() is not null);

create index if not exists idx_question_images_question_id
  on public.question_images(question_id);
