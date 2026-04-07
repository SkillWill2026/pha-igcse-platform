create sequence if not exists public.question_serial_seq start 1;

alter table public.questions
  add column if not exists serial_number text unique;

update public.questions
  set serial_number = 'PHA-' || lpad(nextval('public.question_serial_seq')::text, 5, '0')
  where serial_number is null;

create or replace function public.set_question_serial()
returns trigger language plpgsql as $$
begin
  if new.serial_number is null then
    new.serial_number := 'PHA-' || lpad(nextval('public.question_serial_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_question_serial on public.questions;
create trigger trg_question_serial
  before insert on public.questions
  for each row execute function public.set_question_serial();
