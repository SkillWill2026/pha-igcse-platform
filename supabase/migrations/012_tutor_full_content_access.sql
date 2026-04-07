-- TOPICS
drop policy if exists "Tutors read topics" on public.topics;
create policy "Tutors full access on topics"
  on public.topics for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','tutor')));

-- SUBTOPICS
drop policy if exists "Tutors read subtopics" on public.subtopics;
create policy "Tutors full access on subtopics"
  on public.subtopics for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','tutor')));

-- SUB_SUBTOPICS
drop policy if exists "Tutors read sub_subtopics" on public.sub_subtopics;
create policy "Tutors full access on sub_subtopics"
  on public.sub_subtopics for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','tutor')));

-- QUESTIONS
drop policy if exists "Tutors read questions" on public.questions;
create policy "Tutors full access on questions"
  on public.questions for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','tutor')));

-- ANSWERS
drop policy if exists "Tutors read answers" on public.answers;
create policy "Tutors full access on answers"
  on public.answers for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','tutor')));

-- QUESTION_IMAGES
drop policy if exists "Tutors read question_images" on public.question_images;
create policy "Tutors full access on question_images"
  on public.question_images for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','tutor')));

-- UPLOAD_BATCHES
drop policy if exists "Tutors read upload_batches" on public.upload_batches;
create policy "Tutors full access on upload_batches"
  on public.upload_batches for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','tutor')));

-- PPT_DECKS (if table exists)
drop policy if exists "Tutors read ppt_decks" on public.ppt_decks;
create policy "Tutors full access on ppt_decks"
  on public.ppt_decks for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','tutor')));
