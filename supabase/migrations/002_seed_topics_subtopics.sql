-- ============================================================
-- Seed: Cambridge IGCSE Mathematics 0580
-- Topics C1–C9  |  49 subtopics  |  Sprint weeks 1–14
-- Due dates: 10-Apr-2026 → 10-Jul-2026
-- ============================================================

-- ─────────────────────────────────────────────
-- exam_boards
-- ─────────────────────────────────────────────
insert into exam_boards (name) values
  ('Cambridge 0580'),
  ('Pearson Edexcel'),
  ('Oxford AQA')
on conflict (name) do nothing;   -- requires exam_boards_name_key unique constraint (migration 003)

-- ─────────────────────────────────────────────
-- topics  (C1–C9)
-- subtopic_count and question_target are the sums of
-- their children's question_target (156 or 157 each).
-- completion_date = due_date of the last subtopic in that topic.
-- ─────────────────────────────────────────────
insert into topics (ref, name, subtopic_count, question_target, completion_date) values
  ('C1', 'Number',                       6,  939,  '2026-04-17'),
  ('C2', 'Algebra and Graphs',           7, 1096,  '2026-05-01'),
  ('C3', 'Coordinate Geometry',          4,  626,  '2026-05-08'),
  ('C4', 'Geometry',                     6,  939,  '2026-05-22'),
  ('C5', 'Mensuration',                  5,  783,  '2026-06-05'),
  ('C6', 'Trigonometry',                 5,  782,  '2026-06-12'),
  ('C7', 'Vectors and Transformations',  6,  939,  '2026-06-26'),
  ('C8', 'Probability',                  5,  782,  '2026-07-03'),
  ('C9', 'Statistics',                   5,  783,  '2026-07-10')
on conflict (ref) do nothing;

-- ─────────────────────────────────────────────
-- subtopics
-- Sprint week due dates:
--   Wk 1  → 2026-04-10   Wk 8  → 2026-05-29
--   Wk 2  → 2026-04-17   Wk 9  → 2026-06-05
--   Wk 3  → 2026-04-24   Wk 10 → 2026-06-12
--   Wk 4  → 2026-05-01   Wk 11 → 2026-06-19
--   Wk 5  → 2026-05-08   Wk 12 → 2026-06-26
--   Wk 6  → 2026-05-15   Wk 13 → 2026-07-03
--   Wk 7  → 2026-05-22   Wk 14 → 2026-07-10
-- ─────────────────────────────────────────────
insert into subtopics (topic_id, ref, name, sprint_week, due_date, question_target)
select t.id, s.ref, s.name, s.sprint_week, s.due_date::date, s.question_target
from topics t
join (values

  -- ── C1 Number (weeks 1-2) ──────────────────────────────────
  ('C1', '1.1', 'Types of Number',                     1, '2026-04-10', 157),
  ('C1', '1.2', 'Sets',                                1, '2026-04-10', 156),
  ('C1', '1.3', 'Powers, Roots and Indices',           1, '2026-04-10', 157),
  ('C1', '1.4', 'Fractions, Decimals and Percentages', 2, '2026-04-17', 156),
  ('C1', '1.5', 'Ordering and the Number Line',        2, '2026-04-17', 157),
  ('C1', '1.6', 'Ratio and Proportion',                2, '2026-04-17', 156),

  -- ── C2 Algebra and Graphs (weeks 3-4) ─────────────────────
  ('C2', '2.1', 'Introduction to Algebra',             3, '2026-04-24', 157),
  ('C2', '2.2', 'Algebraic Manipulation',              3, '2026-04-24', 156),
  ('C2', '2.3', 'Algebraic Fractions',                 3, '2026-04-24', 157),
  ('C2', '2.4', 'Equations and Inequalities',          4, '2026-05-01', 156),
  ('C2', '2.5', 'Sequences',                           4, '2026-05-01', 157),
  ('C2', '2.6', 'Functions',                           4, '2026-05-01', 156),
  ('C2', '2.7', 'Graphs of Functions',                 4, '2026-05-01', 157),

  -- ── C3 Coordinate Geometry (week 5) ───────────────────────
  ('C3', '3.1', 'Coordinates',                         5, '2026-05-08', 156),
  ('C3', '3.2', 'The Straight Line',                   5, '2026-05-08', 157),
  ('C3', '3.3', 'Parallel and Perpendicular Lines',    5, '2026-05-08', 156),
  ('C3', '3.4', 'Equation of a Line',                  5, '2026-05-08', 157),

  -- ── C4 Geometry (weeks 6-7) ───────────────────────────────
  ('C4', '4.1', 'Angles and Polygons',                 6, '2026-05-15', 156),
  ('C4', '4.2', 'Circles',                             6, '2026-05-15', 157),
  ('C4', '4.3', 'Similarity and Congruence',           6, '2026-05-15', 156),
  ('C4', '4.4', 'Symmetry',                            7, '2026-05-22', 157),
  ('C4', '4.5', 'Circle Theorems',                     7, '2026-05-22', 156),
  ('C4', '4.6', 'Constructions and Loci',              7, '2026-05-22', 157),

  -- ── C5 Mensuration (weeks 8-9) ────────────────────────────
  ('C5', '5.1', 'Area and Perimeter',                  8, '2026-05-29', 157),
  ('C5', '5.2', 'Volume and Surface Area',             8, '2026-05-29', 156),
  ('C5', '5.3', 'Compound Shapes and Solids',          8, '2026-05-29', 157),
  ('C5', '5.4', 'Arcs and Sectors',                    9, '2026-06-05', 156),
  ('C5', '5.5', 'Rates Involving Area and Volume',     9, '2026-06-05', 157),

  -- ── C6 Trigonometry (week 10) ─────────────────────────────
  ('C6', '6.1', 'Pythagoras'' Theorem',               10, '2026-06-12', 156),
  ('C6', '6.2', 'Trigonometric Ratios',               10, '2026-06-12', 157),
  ('C6', '6.3', 'Sine Rule and Cosine Rule',          10, '2026-06-12', 156),
  ('C6', '6.4', 'Trigonometric Graphs and Equations', 10, '2026-06-12', 157),
  ('C6', '6.5', '3D Trigonometry',                    10, '2026-06-12', 156),

  -- ── C7 Vectors and Transformations (weeks 11-12) ──────────
  ('C7', '7.1', 'Introduction to Vectors',            11, '2026-06-19', 157),
  ('C7', '7.2', 'Vector Arithmetic',                  11, '2026-06-19', 156),
  ('C7', '7.3', 'Translations',                       11, '2026-06-19', 157),
  ('C7', '7.4', 'Reflections',                        12, '2026-06-26', 156),
  ('C7', '7.5', 'Rotations',                          12, '2026-06-26', 157),
  ('C7', '7.6', 'Enlargements',                       12, '2026-06-26', 156),

  -- ── C8 Probability (week 13) ──────────────────────────────
  ('C8', '8.1', 'Basic Probability',                  13, '2026-07-03', 156),
  ('C8', '8.2', 'Combined Events and Venn Diagrams',  13, '2026-07-03', 157),
  ('C8', '8.3', 'Tree Diagrams',                      13, '2026-07-03', 156),
  ('C8', '8.4', 'Conditional Probability',            13, '2026-07-03', 157),
  ('C8', '8.5', 'Experimental Probability',           13, '2026-07-03', 156),

  -- ── C9 Statistics (week 14) ───────────────────────────────
  ('C9', '9.1', 'Statistical Diagrams',               14, '2026-07-10', 157),
  ('C9', '9.2', 'Averages and Measures of Spread',    14, '2026-07-10', 156),
  ('C9', '9.3', 'Cumulative Frequency',               14, '2026-07-10', 157),
  ('C9', '9.4', 'Box-and-Whisker Plots',              14, '2026-07-10', 156),
  ('C9', '9.5', 'Histograms',                         14, '2026-07-10', 157)

) as s(topic_ref, ref, name, sprint_week, due_date, question_target)
  on t.ref = s.topic_ref
on conflict (ref) do nothing;

-- Verify counts
-- select count(*) from subtopics;  -- expected: 49
-- select t.ref, count(s.id) from topics t join subtopics s on s.topic_id = t.id group by t.ref order by t.ref;
