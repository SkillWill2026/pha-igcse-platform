-- 014_fix_serial_sequence.sql
-- Sync question_serial_seq_new to current max serial number to prevent race conditions

-- Sync the sequence to the highest serial number already in use
select setval('public.question_serial_seq_new',
  coalesce(
    (select max(cast(substring(serial_number, 3) as integer))
     from public.questions
     where serial_number ~ '^Q-[0-9]+$'),
    0
  ) + 1
);

-- Verify the trigger function is using the sequence (should already be set by migration 013)
-- This ensures nextval() is called, not COUNT(*) or MAX()
create or replace function public.set_question_serial()
returns trigger language plpgsql as $$
begin
  if new.serial_number is null then
    new.serial_number := 'Q-' || lpad(nextval('public.question_serial_seq_new')::text, 4, '0');
  end if;
  return new;
end;
$$;

-- Re-create the trigger to ensure it uses the corrected function
drop trigger if exists trg_question_serial on public.questions;
create trigger trg_question_serial
  before insert on public.questions
  for each row execute function public.set_question_serial();
