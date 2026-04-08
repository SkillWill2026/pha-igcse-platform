-- 1. Update questions status enum to include rejected and deleted
alter type question_status add value if not exists 'rejected';
alter type question_status add value if not exists 'deleted';

-- 2. Update answers status enum to include rejected and deleted
alter type answer_status add value if not exists 'rejected';
alter type answer_status add value if not exists 'deleted';

-- 3. Add serial_number to answers table
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

-- 4. Backfill existing question serial numbers from PHA-XXXXX to Q-XXXX format
-- Reset sequence first
create sequence if not exists public.question_serial_seq_new start 1;

with ordered as (
  select id, row_number() over (order by serial_number) as rn
  from public.questions
  where serial_number is not null
)
update public.questions q
  set serial_number = 'Q-' || lpad(ordered.rn::text, 4, '0')
  from ordered
  where q.id = ordered.id;

-- Update trigger to use new format
create or replace function public.set_question_serial()
returns trigger language plpgsql as $$
begin
  if new.serial_number is null then
    new.serial_number := 'Q-' || lpad(nextval('public.question_serial_seq_new')::text, 4, '0');
  end if;
  return new;
end;
$$;
