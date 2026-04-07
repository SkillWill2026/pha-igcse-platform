-- Add missing FK constraints so PostgREST can resolve embedded joins
alter table public.questions
  drop constraint if exists questions_topic_id_fkey,
  drop constraint if exists questions_subtopic_id_fkey;

alter table public.questions
  add constraint questions_topic_id_fkey
    foreign key (topic_id) references public.topics(id) on delete set null;

alter table public.questions
  add constraint questions_subtopic_id_fkey
    foreign key (subtopic_id) references public.subtopics(id) on delete set null;

-- Reload PostgREST schema cache
notify pgrst, 'reload schema';
