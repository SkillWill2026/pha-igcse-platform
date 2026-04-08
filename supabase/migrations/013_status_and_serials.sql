-- 013_status_and_serials.sql
-- Adds rejected/deleted status support, answer serials, and backfills question serials to Q-XXXX format

-- 1. Extend the shared content_status_enum used by both questions and answers
alter type content_status_enum add value if not exists 'rejected';
alter type content_status_enum add value if not exists 'deleted';

-- 2. Add serial_number to answers table
create sequence if not exists public.answer_serial_seq start 1;

alter table public.answers
  add column if not exists serial_number text unique;

update public.answers
  set serial_number = 'A-' || lpad(nextval('public.answer_serial_seq')::text, 4, '0')
  where serial_number is null;

create or replace function public.set_answer_serial()
returns trigger language plpgsql as $$
begin
  if new.serial_number is null then
    new.serial_number := 'A-' || lpad(nextval('public.answer_serial_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_answer_serial on public.answers;
create trigger trg_answer_serial
  before insert on public.answers
  for each row execute function public.set_answer_serial();

-- 3. Backfill existing question serial numbers to Q-XXXX format
create sequence if not exists public.question_serial_seq_new start 1;

do $$
declare
  q record;
  counter integer := 1;
begin
  for q in (select id from public.questions where serial_number is not null order by created_at)
  loop
    update public.questions
      set serial_number = 'Q-' || lpad(counter::text, 4, '0')
      where id = q.id;
    counter := counter + 1;
  end loop;
end;
$$;

-- 4. Update question serial trigger to use Q- format
create or replace function public.set_question_serial()
returns trigger language plpgsql as $$
begin
  if new.serial_number is null then
    new.serial_number := 'Q-' || lpad(nextval('public.question_serial_seq_new')::text, 4, '0');
  end if;
  return new;
end;
$$;
