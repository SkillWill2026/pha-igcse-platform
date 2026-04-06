-- ============================================================
-- Fix: deduplicate exam_boards and add UNIQUE(name) constraint
-- Run this once against the live database.
-- ============================================================

-- Step 1: Delete duplicates, keeping the earliest-inserted row per name.
-- questions.exam_board_id FK rows are preserved because we keep the
-- canonical (oldest) id for each name.
with ranked as (
  select
    id,
    row_number() over (partition by name order by created_at, id) as rn
  from exam_boards
)
delete from exam_boards
where id in (select id from ranked where rn > 1);

-- Step 2: Add the unique constraint so future seed re-runs are safe.
alter table exam_boards
  add constraint exam_boards_name_key unique (name);
