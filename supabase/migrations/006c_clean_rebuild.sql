-- ================================================================
-- 006c_clean_rebuild.sql
-- Clean rebuild from known database state.
-- subtopics: 50 rows, no tier column, old schema
-- sub_subtopics: EXISTS with wrong schema (ref/title/syllabus_code)
-- ================================================================

-- ────────────────────────────────────────────
-- Step 1 — safe teardown
-- ────────────────────────────────────────────

-- nullify any question FKs first
update public.questions set sub_subtopic_id = null
  where sub_subtopic_id is not null;

-- drop old sub_subtopics entirely (wrong schema)
drop table if exists public.sub_subtopics cascade;

-- clear subtopics
truncate table public.subtopics restart identity cascade;

-- add tier column if it doesn't exist
alter table public.subtopics
  add column if not exists tier text not null default 'both'
  check (tier in ('both', 'extended'));

-- ensure unique constraint on ref
alter table public.subtopics
  drop constraint if exists subtopics_ref_key;
alter table public.subtopics
  add constraint subtopics_ref_key unique (ref);

-- ────────────────────────────────────────────
-- Step 2 — create sub_subtopics with correct schema
-- ────────────────────────────────────────────

create table public.sub_subtopics (
  id          uuid        primary key default gen_random_uuid(),
  subtopic_id uuid        not null references public.subtopics(id) on delete cascade,
  ext_num     integer     not null,
  core_num    integer,
  outcome     text        not null,
  tier        text        not null default 'both' check (tier in ('both', 'extended')),
  notes       text[],
  sort_order  integer     not null default 0,
  created_at  timestamptz default now()
);

alter table public.sub_subtopics enable row level security;

create policy "Admins full access on sub_subtopics"
  on public.sub_subtopics for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Tutors read sub_subtopics"
  on public.sub_subtopics for select
  using (auth.uid() is not null);

-- ────────────────────────────────────────────
-- Step 3 — add sub_subtopic_id to questions if not exists
-- ────────────────────────────────────────────

alter table public.questions
  add column if not exists sub_subtopic_id uuid
  references public.sub_subtopics(id) on delete set null;

create index if not exists idx_questions_sub_subtopic
  on public.questions(sub_subtopic_id);

-- ────────────────────────────────────────────
-- Step 4 — seed 72 subtopics
-- ────────────────────────────────────────────

with t as (select id from public.topics where ref = 'C1')
insert into public.subtopics (topic_id, ref, title, tier, sort_order)
select t.id, v.ref, v.title, v.tier, v.sort_order
from t, (values
  ('C1.1',  'Types of number',                     'both',     1),
  ('C1.2',  'Sets',                                'both',     2),
  ('C1.3',  'Powers and roots',                    'both',     3),
  ('C1.4',  'Fractions decimals and percentages',  'both',     4),
  ('C1.5',  'Ordering',                            'both',     5),
  ('C1.6',  'The four operations',                 'both',     6),
  ('C1.7',  'Indices I',                           'both',     7),
  ('C1.8',  'Standard form',                       'both',     8),
  ('C1.9',  'Estimation',                          'both',     9),
  ('C1.10', 'Limits of accuracy',                  'both',     10),
  ('C1.11', 'Ratio and proportion',                'both',     11),
  ('C1.12', 'Rates',                               'both',     12),
  ('C1.13', 'Percentages',                         'both',     13),
  ('C1.14', 'Using a calculator',                  'both',     14),
  ('C1.15', 'Time',                                'both',     15),
  ('C1.16', 'Money',                               'both',     16),
  ('E1.17', 'Exponential growth and decay',        'extended', 17),
  ('E1.18', 'Surds',                               'extended', 18)
) as v(ref, title, tier, sort_order);

with t as (select id from public.topics where ref = 'C2')
insert into public.subtopics (topic_id, ref, title, tier, sort_order)
select t.id, v.ref, v.title, v.tier, v.sort_order
from t, (values
  ('C2.1',  'Introduction to algebra',         'both',     1),
  ('C2.2',  'Algebraic manipulation',          'both',     2),
  ('E2.3',  'Algebraic fractions',             'extended', 3),
  ('C2.4',  'Indices II',                      'both',     4),
  ('C2.5',  'Equations',                       'both',     5),
  ('C2.6',  'Inequalities',                    'both',     6),
  ('C2.7',  'Sequences',                       'both',     7),
  ('E2.8',  'Proportion',                      'extended', 8),
  ('C2.9',  'Graphs in practical situations',  'both',     9),
  ('C2.10', 'Graphs of functions',             'both',     10),
  ('C2.11', 'Sketching curves',                'both',     11),
  ('E2.12', 'Differentiation',                 'extended', 12),
  ('E2.13', 'Functions',                       'extended', 13)
) as v(ref, title, tier, sort_order);

with t as (select id from public.topics where ref = 'C3')
insert into public.subtopics (topic_id, ref, title, tier, sort_order)
select t.id, v.ref, v.title, v.tier, v.sort_order
from t, (values
  ('C3.1', 'Coordinates',                'both',     1),
  ('C3.2', 'Drawing linear graphs',      'both',     2),
  ('C3.3', 'Gradient of linear graphs',  'both',     3),
  ('E3.4', 'Length and midpoint',        'extended', 4),
  ('C3.5', 'Equations of linear graphs', 'both',     5),
  ('C3.6', 'Parallel lines',             'both',     6),
  ('E3.7', 'Perpendicular lines',        'extended', 7)
) as v(ref, title, tier, sort_order);

with t as (select id from public.topics where ref = 'C4')
insert into public.subtopics (topic_id, ref, title, tier, sort_order)
select t.id, v.ref, v.title, v.tier, v.sort_order
from t, (values
  ('C4.1', 'Geometrical terms',          'both',     1),
  ('C4.2', 'Geometrical constructions',  'both',     2),
  ('C4.3', 'Scale drawings',             'both',     3),
  ('C4.4', 'Similarity',                 'both',     4),
  ('C4.5', 'Symmetry',                   'both',     5),
  ('C4.6', 'Angles',                     'both',     6),
  ('C4.7', 'Circle theorems I',          'both',     7),
  ('E4.8', 'Circle theorems II',         'extended', 8)
) as v(ref, title, tier, sort_order);

with t as (select id from public.topics where ref = 'C5')
insert into public.subtopics (topic_id, ref, title, tier, sort_order)
select t.id, v.ref, v.title, v.tier, v.sort_order
from t, (values
  ('C5.1', 'Units of measure',                   'both', 1),
  ('C5.2', 'Area and perimeter',                 'both', 2),
  ('C5.3', 'Circles arcs and sectors',           'both', 3),
  ('C5.4', 'Surface area and volume',            'both', 4),
  ('C5.5', 'Compound shapes and parts of shapes','both', 5)
) as v(ref, title, tier, sort_order);

with t as (select id from public.topics where ref = 'C6')
insert into public.subtopics (topic_id, ref, title, tier, sort_order)
select t.id, v.ref, v.title, v.tier, v.sort_order
from t, (values
  ('C6.1', 'Pythagoras theorem',                        'both',     1),
  ('C6.2', 'Right-angled triangles',                    'both',     2),
  ('E6.3', 'Exact trigonometric values',                'extended', 3),
  ('E6.4', 'Trigonometric functions',                   'extended', 4),
  ('E6.5', 'Non-right-angled triangles',                'extended', 5),
  ('E6.6', 'Pythagoras theorem and trigonometry in 3D', 'extended', 6)
) as v(ref, title, tier, sort_order);

with t as (select id from public.topics where ref = 'C7')
insert into public.subtopics (topic_id, ref, title, tier, sort_order)
select t.id, v.ref, v.title, v.tier, v.sort_order
from t, (values
  ('C7.1', 'Transformations',          'both',     1),
  ('E7.2', 'Vectors in two dimensions','extended', 2),
  ('E7.3', 'Magnitude of a vector',    'extended', 3),
  ('E7.4', 'Vector geometry',          'extended', 4)
) as v(ref, title, tier, sort_order);

with t as (select id from public.topics where ref = 'C8')
insert into public.subtopics (topic_id, ref, title, tier, sort_order)
select t.id, v.ref, v.title, v.tier, v.sort_order
from t, (values
  ('C8.1', 'Introduction to probability',       'both',     1),
  ('C8.2', 'Relative and expected frequencies', 'both',     2),
  ('C8.3', 'Probability of combined events',    'both',     3),
  ('E8.4', 'Conditional probability',           'extended', 4)
) as v(ref, title, tier, sort_order);

with t as (select id from public.topics where ref = 'C9')
insert into public.subtopics (topic_id, ref, title, tier, sort_order)
select t.id, v.ref, v.title, v.tier, v.sort_order
from t, (values
  ('C9.1', 'Classifying statistical data',   'both',     1),
  ('C9.2', 'Interpreting statistical data',  'both',     2),
  ('C9.3', 'Averages and range',             'both',     3),
  ('C9.4', 'Statistical charts and diagrams','both',     4),
  ('C9.5', 'Scatter diagrams',               'both',     5),
  ('E9.6', 'Cumulative frequency diagrams',  'extended', 6),
  ('E9.7', 'Histograms',                     'extended', 7)
) as v(ref, title, tier, sort_order);

-- ────────────────────────────────────────────
-- Step 5 — seed 171 sub_subtopics (one large insert, join on subtopic ref)
-- ────────────────────────────────────────────

insert into public.sub_subtopics (subtopic_id, ext_num, core_num, outcome, tier, sort_order)
select s.id, v.ext_num, v.core_num, v.outcome, v.tier, v.sort_order
from public.subtopics s
join (values

  -- ── C1.1 Types of number ─────────────────────────────────────
  ('C1.1', 1, null::integer, 'Identify and use natural numbers, integers, prime numbers, square numbers, cube numbers, common factors, common multiples, rational and irrational numbers, and reciprocals', 'both', 1),

  -- ── C1.2 Sets ────────────────────────────────────────────────
  ('C1.2', 1, null::integer, 'Understand and use set language, notation and Venn diagrams to describe sets and represent relationships between sets', 'both', 1),

  -- ── C1.3 Powers and roots ────────────────────────────────────
  ('C1.3', 1, null::integer, 'Calculate with squares, square roots, cubes, cube roots and other powers and roots of numbers', 'both', 1),

  -- ── C1.4 Fractions decimals and percentages ──────────────────
  ('C1.4', 1, null::integer, 'Use the language and notation of proper fractions, improper fractions, mixed numbers, decimals and percentages in appropriate contexts', 'both', 1),
  ('C1.4', 2, null::integer, 'Recognise equivalence and convert between these forms', 'both', 2),

  -- ── C1.5 Ordering ────────────────────────────────────────────
  ('C1.5', 1, null::integer, 'Order quantities by magnitude and demonstrate familiarity with the symbols = ≠ > < ≥ ≤', 'both', 1),

  -- ── C1.6 The four operations ─────────────────────────────────
  ('C1.6', 1, null::integer, 'Use the four operations for calculations with integers, fractions and decimals including correct ordering of operations and use of brackets', 'both', 1),

  -- ── C1.7 Indices I ───────────────────────────────────────────
  ('C1.7', 1, null::integer, 'Understand and use indices — Core: positive, zero and negative integers; Extended: also fractional indices', 'both', 1),
  ('C1.7', 2, null::integer, 'Understand and use the rules of indices', 'both', 2),

  -- ── C1.8 Standard form ───────────────────────────────────────
  ('C1.8', 1, null::integer, 'Use the standard form A × 10ⁿ where n is a positive or negative integer and 1 ≤ A < 10', 'both', 1),
  ('C1.8', 2, null::integer, 'Convert numbers into and out of standard form', 'both', 2),
  ('C1.8', 3, null::integer, 'Calculate with values in standard form', 'both', 3),

  -- ── C1.9 Estimation ──────────────────────────────────────────
  ('C1.9', 1, null::integer, 'Round values to a specified degree of accuracy', 'both', 1),
  ('C1.9', 2, null::integer, 'Make estimates for calculations involving numbers, quantities and measurements', 'both', 2),
  ('C1.9', 3, null::integer, 'Round answers to a reasonable degree of accuracy in the context of a given problem', 'both', 3),

  -- ── C1.10 Limits of accuracy ─────────────────────────────────
  ('C1.10', 1, null::integer, 'Give upper and lower bounds for data rounded to a specified accuracy', 'both', 1),
  ('C1.10', 2, null::integer, 'Find upper and lower bounds of the results of calculations which have used data rounded to a specified accuracy', 'extended', 2),

  -- ── C1.11 Ratio and proportion ───────────────────────────────
  ('C1.11', 1, null::integer, 'Understand and use ratio and proportion to give ratios in simplest form, divide a quantity in a given ratio, and use proportional reasoning and ratios in context', 'both', 1),

  -- ── C1.12 Rates ──────────────────────────────────────────────
  ('C1.12', 1, null::integer, 'Use common measures of rate', 'both', 1),
  ('C1.12', 2, null::integer, 'Apply other measures of rate including pressure, density and population density', 'both', 2),
  ('C1.12', 3, null::integer, 'Solve problems involving average speed', 'both', 3),

  -- ── C1.13 Percentages ────────────────────────────────────────
  ('C1.13', 1, null::integer, 'Calculate a given percentage of a quantity', 'both', 1),
  ('C1.13', 2, null::integer, 'Express one quantity as a percentage of another', 'both', 2),
  ('C1.13', 3, null::integer, 'Calculate percentage increase or decrease', 'both', 3),
  ('C1.13', 4, null::integer, 'Calculate with simple and compound interest', 'both', 4),
  ('C1.13', 5, null::integer, 'Calculate using reverse percentages', 'extended', 5),

  -- ── C1.14 Using a calculator ─────────────────────────────────
  ('C1.14', 1, null::integer, 'Use a calculator efficiently', 'both', 1),
  ('C1.14', 2, null::integer, 'Enter values appropriately on a calculator', 'both', 2),
  ('C1.14', 3, null::integer, 'Interpret the calculator display appropriately', 'both', 3),

  -- ── C1.15 Time ───────────────────────────────────────────────
  ('C1.15', 1, null::integer, 'Calculate with time in seconds, minutes, hours, days, weeks, months and years including relationships between units', 'both', 1),
  ('C1.15', 2, null::integer, 'Calculate times in terms of the 24-hour and 12-hour clock', 'both', 2),
  ('C1.15', 3, null::integer, 'Read clocks and timetables', 'both', 3),

  -- ── C1.16 Money ──────────────────────────────────────────────
  ('C1.16', 1, null::integer, 'Calculate with money', 'both', 1),
  ('C1.16', 2, null::integer, 'Convert from one currency to another', 'both', 2),

  -- ── E1.17 Exponential growth and decay ───────────────────────
  ('E1.17', 1, null::integer, 'Use exponential growth and decay', 'extended', 1),

  -- ── E1.18 Surds ──────────────────────────────────────────────
  ('E1.18', 1, null::integer, 'Understand and use surds including simplifying expressions', 'extended', 1),
  ('E1.18', 2, null::integer, 'Rationalise the denominator', 'extended', 2),

  -- ── C2.1 Introduction to algebra ─────────────────────────────
  ('C2.1', 1, null::integer, 'Know that letters can be used to represent generalised numbers', 'both', 1),
  ('C2.1', 2, null::integer, 'Substitute numbers into expressions and formulas', 'both', 2),

  -- ── C2.2 Algebraic manipulation ──────────────────────────────
  ('C2.2', 1, null::integer, 'Simplify expressions by collecting like terms', 'both', 1),
  ('C2.2', 2, null::integer, 'Expand products of algebraic expressions', 'both', 2),
  ('C2.2', 3, null::integer, 'Factorise by extracting common factors', 'both', 3),
  ('C2.2', 4, null::integer, 'Factorise expressions of the forms ax+bx+kay+kby and a²x²−b²y² and a²+2ab+b² and ax²+bx+c and ax³+bx²+cx', 'extended', 4),
  ('C2.2', 5, null::integer, 'Complete the square for expressions in the form ax²+bx+c', 'extended', 5),

  -- ── E2.3 Algebraic fractions ─────────────────────────────────
  ('E2.3', 1, null::integer, 'Manipulate algebraic fractions', 'extended', 1),
  ('E2.3', 2, null::integer, 'Factorise and simplify rational expressions', 'extended', 2),

  -- ── C2.4 Indices II ──────────────────────────────────────────
  ('C2.4', 1, null::integer, 'Understand and use indices — Core: positive, zero and negative; Extended: also fractional', 'both', 1),
  ('C2.4', 2, null::integer, 'Understand and use the rules of indices', 'both', 2),

  -- ── C2.5 Equations ───────────────────────────────────────────
  ('C2.5', 1, 1, 'Construct expressions, equations and formulas', 'both', 1),
  ('C2.5', 2, 2, 'Solve linear equations in one unknown', 'both', 2),
  ('C2.5', 3, null::integer, 'Solve fractional equations with numerical and linear algebraic denominators', 'extended', 3),
  ('C2.5', 4, 3, 'Solve simultaneous linear equations in two unknowns', 'both', 4),
  ('C2.5', 5, null::integer, 'Solve simultaneous equations involving one linear and one non-linear', 'extended', 5),
  ('C2.5', 6, null::integer, 'Solve quadratic equations by factorisation, completing the square and by use of the quadratic formula', 'extended', 6),
  ('C2.5', 7, 4, 'Change the subject of formulas', 'both', 7),

  -- ── C2.6 Inequalities ────────────────────────────────────────
  ('C2.6', 1, null::integer, 'Represent and interpret inequalities including on a number line', 'both', 1),
  ('C2.6', 2, null::integer, 'Construct, solve and interpret linear inequalities', 'extended', 2),
  ('C2.6', 3, null::integer, 'Represent and interpret linear inequalities in two variables graphically', 'extended', 3),
  ('C2.6', 4, null::integer, 'List inequalities that define a given region', 'extended', 4),

  -- ── C2.7 Sequences ───────────────────────────────────────────
  ('C2.7', 1, null::integer, 'Continue a given number sequence or pattern', 'both', 1),
  ('C2.7', 2, null::integer, 'Recognise patterns in sequences including the term-to-term rule and relationships between different sequences', 'both', 2),
  ('C2.7', 3, null::integer, 'Find and use the nth term of sequences — Core: linear, simple quadratic, simple cubic; Extended: also exponential sequences and combinations', 'both', 3),

  -- ── E2.8 Proportion ──────────────────────────────────────────
  ('E2.8', 1, null::integer, 'Express direct and inverse proportion in algebraic terms and use this form of expression to find unknown quantities', 'extended', 1),

  -- ── C2.9 Graphs in practical situations ──────────────────────
  ('C2.9', 1, null::integer, 'Use and interpret graphs in practical situations including travel graphs and conversion graphs', 'both', 1),
  ('C2.9', 2, null::integer, 'Draw graphs from given data', 'both', 2),
  ('C2.9', 3, null::integer, 'Apply the idea of rate of change to simple kinematics involving distance-time and speed-time graphs, acceleration and deceleration', 'extended', 3),
  ('C2.9', 4, null::integer, 'Calculate distance travelled as area under a speed-time graph', 'extended', 4),

  -- ── C2.10 Graphs of functions ────────────────────────────────
  ('C2.10', 1, null::integer, 'Construct tables of values and draw, recognise and interpret graphs for functions', 'both', 1),
  ('C2.10', 2, null::integer, 'Solve associated equations graphically including finding and interpreting roots by graphical methods', 'both', 2),
  ('C2.10', 3, null::integer, 'Draw and interpret graphs representing exponential growth and decay problems', 'extended', 3),

  -- ── C2.11 Sketching curves ───────────────────────────────────
  ('C2.11', 1, null::integer, 'Recognise, sketch and interpret graphs of linear functions', 'both', 1),
  ('C2.11', 2, null::integer, 'Recognise, sketch and interpret graphs of quadratic functions', 'both', 2),
  ('C2.11', 3, null::integer, 'Recognise, sketch and interpret graphs of cubic functions', 'extended', 3),
  ('C2.11', 4, null::integer, 'Recognise, sketch and interpret graphs of reciprocal functions', 'extended', 4),
  ('C2.11', 5, null::integer, 'Recognise, sketch and interpret graphs of exponential functions', 'extended', 5),

  -- ── E2.12 Differentiation ────────────────────────────────────
  ('E2.12', 1, null::integer, 'Estimate gradients of curves by drawing tangents', 'extended', 1),
  ('E2.12', 2, null::integer, 'Use the derivatives of functions of the form axⁿ and simple sums of no more than three of these', 'extended', 2),
  ('E2.12', 3, null::integer, 'Apply differentiation to gradients and stationary points', 'extended', 3),
  ('E2.12', 4, null::integer, 'Discriminate between maxima and minima by any method', 'extended', 4),

  -- ── E2.13 Functions ──────────────────────────────────────────
  ('E2.13', 1, null::integer, 'Understand functions, domain and range and use function notation', 'extended', 1),
  ('E2.13', 2, null::integer, 'Understand and find inverse functions f⁻¹(x)', 'extended', 2),
  ('E2.13', 3, null::integer, 'Form composite functions as defined by gf(x) = g(f(x))', 'extended', 3),

  -- ── C3.1 Coordinates ─────────────────────────────────────────
  ('C3.1', 1, null::integer, 'Use and interpret Cartesian coordinates in two dimensions', 'both', 1),

  -- ── C3.2 Drawing linear graphs ───────────────────────────────
  ('C3.2', 1, null::integer, 'Draw straight-line graphs for linear equations', 'both', 1),

  -- ── C3.3 Gradient of linear graphs ───────────────────────────
  ('C3.3', 1, null::integer, 'Find the gradient of a straight line', 'both', 1),
  ('C3.3', 2, null::integer, 'Calculate the gradient of a straight line from the coordinates of two points on it', 'extended', 2),

  -- ── E3.4 Length and midpoint ─────────────────────────────────
  ('E3.4', 1, null::integer, 'Calculate the length of a line segment', 'extended', 1),
  ('E3.4', 2, null::integer, 'Find the coordinates of the midpoint of a line segment', 'extended', 2),

  -- ── C3.5 Equations of linear graphs ──────────────────────────
  ('C3.5', 1, null::integer, 'Interpret and obtain the equation of a straight-line graph', 'both', 1),

  -- ── C3.6 Parallel lines ──────────────────────────────────────
  ('C3.6', 1, null::integer, 'Find the gradient and equation of a straight line parallel to a given line', 'both', 1),

  -- ── E3.7 Perpendicular lines ─────────────────────────────────
  ('E3.7', 1, null::integer, 'Find the gradient and equation of a straight line perpendicular to a given line', 'extended', 1),

  -- ── C4.1 Geometrical terms ───────────────────────────────────
  ('C4.1', 1, null::integer, 'Use and interpret geometrical terms', 'both', 1),
  ('C4.1', 2, null::integer, 'Use and interpret the vocabulary of triangles, quadrilaterals, polygons, nets and solids', 'both', 2),
  ('C4.1', 3, null::integer, 'Use and interpret the vocabulary of a circle', 'both', 3),

  -- ── C4.2 Geometrical constructions ───────────────────────────
  ('C4.2', 1, null::integer, 'Measure and draw lines and angles', 'both', 1),
  ('C4.2', 2, null::integer, 'Construct a triangle given the lengths of all sides using a ruler and pair of compasses only', 'both', 2),
  ('C4.2', 3, null::integer, 'Draw, use and interpret nets', 'both', 3),

  -- ── C4.3 Scale drawings ──────────────────────────────────────
  ('C4.3', 1, null::integer, 'Draw and interpret scale drawings', 'both', 1),
  ('C4.3', 2, null::integer, 'Use and interpret three-figure bearings', 'both', 2),

  -- ── C4.4 Similarity ──────────────────────────────────────────
  ('C4.4', 1, null::integer, 'Calculate lengths of similar shapes', 'both', 1),
  ('C4.4', 2, null::integer, 'Use the relationships between lengths and areas of similar shapes and lengths, surface areas and volumes of similar solids', 'extended', 2),
  ('C4.4', 3, null::integer, 'Solve problems and give simple explanations involving similarity', 'extended', 3),

  -- ── C4.5 Symmetry ────────────────────────────────────────────
  ('C4.5', 1, null::integer, 'Recognise line symmetry and order of rotational symmetry in two dimensions', 'both', 1),
  ('C4.5', 2, null::integer, 'Recognise symmetry properties of prisms, cylinders, pyramids and cones', 'extended', 2),

  -- ── C4.6 Angles ──────────────────────────────────────────────
  ('C4.6', 1, null::integer, 'Calculate unknown angles using sum of angles at a point, sum on a straight line, vertically opposite angles, angle sum of triangle and quadrilateral', 'both', 1),
  ('C4.6', 2, null::integer, 'Calculate unknown angles and give geometric explanations for angles formed within parallel lines — corresponding, alternate and co-interior', 'both', 2),
  ('C4.6', 3, null::integer, 'Know and use angle properties of polygons', 'both', 3),

  -- ── C4.7 Circle theorems I ───────────────────────────────────
  ('C4.7', 1, null::integer, 'Calculate unknown angles using angle in a semicircle = 90° and angle between tangent and radius = 90°', 'both', 1),
  ('C4.7', 2, null::integer, 'Calculate unknown angles using: angle at centre is twice angle at circumference, angles in same segment are equal, opposite angles of cyclic quadrilateral sum to 180°, alternate segment theorem', 'extended', 2),

  -- ── E4.8 Circle theorems II ──────────────────────────────────
  ('E4.8', 1, null::integer, 'Use symmetry property — equal chords are equidistant from the centre', 'extended', 1),
  ('E4.8', 2, null::integer, 'Use symmetry property — perpendicular bisector of a chord passes through the centre', 'extended', 2),
  ('E4.8', 3, null::integer, 'Use symmetry property — tangents from an external point are equal in length', 'extended', 3),

  -- ── C5.1 Units of measure ────────────────────────────────────
  ('C5.1', 1, null::integer, 'Use metric units of mass, length, area, volume and capacity and convert between units', 'both', 1),

  -- ── C5.2 Area and perimeter ──────────────────────────────────
  ('C5.2', 1, null::integer, 'Carry out calculations involving the perimeter and area of a rectangle, triangle, parallelogram and trapezium', 'both', 1),

  -- ── C5.3 Circles arcs and sectors ────────────────────────────
  ('C5.3', 1, null::integer, 'Carry out calculations involving the circumference and area of a circle', 'both', 1),
  ('C5.3', 2, null::integer, 'Carry out calculations involving arc length and sector area as fractions of circumference and area of a circle', 'both', 2),

  -- ── C5.4 Surface area and volume ─────────────────────────────
  ('C5.4', 1, null::integer, 'Carry out calculations involving the surface area and volume of a cuboid, prism, cylinder, sphere, pyramid and cone', 'both', 1),

  -- ── C5.5 Compound shapes and parts of shapes ─────────────────
  ('C5.5', 1, null::integer, 'Carry out calculations involving perimeters and areas of compound shapes and parts of shapes', 'both', 1),
  ('C5.5', 2, null::integer, 'Carry out calculations involving surface areas and volumes of compound solids and parts of solids', 'both', 2),

  -- ── C6.1 Pythagoras theorem ──────────────────────────────────
  ('C6.1', 1, null::integer, 'Know and use Pythagoras'' theorem', 'both', 1),

  -- ── C6.2 Right-angled triangles ──────────────────────────────
  ('C6.2', 1, null::integer, 'Know and use the sine, cosine and tangent ratios for acute angles in calculations involving sides and angles of a right-angled triangle', 'both', 1),
  ('C6.2', 2, null::integer, 'Solve problems in two dimensions using Pythagoras'' theorem and trigonometry', 'both', 2),
  ('C6.2', 3, null::integer, 'Know that the perpendicular distance from a point to a line is the shortest distance to the line', 'extended', 3),
  ('C6.2', 4, null::integer, 'Carry out calculations involving angles of elevation and depression', 'extended', 4),

  -- ── E6.3 Exact trigonometric values ──────────────────────────
  ('E6.3', 1, null::integer, 'Know the exact values of sin x and cos x for x = 0°, 30°, 45°, 60° and 90°', 'extended', 1),
  ('E6.3', 2, null::integer, 'Know the exact values of tan x for x = 0°, 30°, 45° and 60°', 'extended', 2),

  -- ── E6.4 Trigonometric functions ─────────────────────────────
  ('E6.4', 1, null::integer, 'Recognise, sketch and interpret the graphs of y = sin x, y = cos x and y = tan x for 0° ≤ x ≤ 360°', 'extended', 1),
  ('E6.4', 2, null::integer, 'Solve trigonometric equations involving sin x, cos x or tan x for 0° ≤ x ≤ 360°', 'extended', 2),

  -- ── E6.5 Non-right-angled triangles ──────────────────────────
  ('E6.5', 1, null::integer, 'Use the sine and cosine rules in calculations involving lengths and angles for any triangle', 'extended', 1),
  ('E6.5', 2, null::integer, 'Use the formula area of triangle = ½ab sin C', 'extended', 2),

  -- ── E6.6 Pythagoras theorem and trigonometry in 3D ───────────
  ('E6.6', 1, null::integer, 'Carry out calculations and solve problems in three dimensions using Pythagoras'' theorem and trigonometry, including calculating the angle between a line and a plane', 'extended', 1),

  -- ── C7.1 Transformations ─────────────────────────────────────
  ('C7.1', 1, null::integer, 'Reflection of a shape — Core: in a vertical or horizontal line; Extended: in any straight line', 'both', 1),
  ('C7.1', 2, null::integer, 'Rotation of a shape — Core: about the origin, vertices or midpoints through multiples of 90°; Extended: about any centre', 'both', 2),
  ('C7.1', 3, null::integer, 'Enlargement of a shape from a centre by a scale factor — Core: positive and fractional only; Extended: also negative', 'both', 3),
  ('C7.1', 4, null::integer, 'Translation of a shape by a column vector — Core: no combinations; Extended: combinations allowed', 'both', 4),

  -- ── E7.2 Vectors in two dimensions ───────────────────────────
  ('E7.2', 1, null::integer, 'Describe a translation using a vector', 'extended', 1),
  ('E7.2', 2, null::integer, 'Add and subtract vectors', 'extended', 2),
  ('E7.2', 3, null::integer, 'Multiply a vector by a scalar', 'extended', 3),

  -- ── E7.3 Magnitude of a vector ───────────────────────────────
  ('E7.3', 1, null::integer, 'Calculate the magnitude of a vector (x,y) as √(x²+y²)', 'extended', 1),

  -- ── E7.4 Vector geometry ─────────────────────────────────────
  ('E7.4', 1, null::integer, 'Represent vectors by directed line segments', 'extended', 1),
  ('E7.4', 2, null::integer, 'Use position vectors', 'extended', 2),
  ('E7.4', 3, null::integer, 'Use the sum and difference of two or more vectors to express given vectors in terms of two coplanar vectors', 'extended', 3),
  ('E7.4', 4, null::integer, 'Use vectors to reason and to solve geometric problems', 'extended', 4),

  -- ── C8.1 Introduction to probability ─────────────────────────
  ('C8.1', 1, 1, 'Understand and use the probability scale from 0 to 1', 'both', 1),
  ('C8.1', 2, null::integer, 'Understand and use probability notation — P(A) and P(A′)', 'extended', 2),
  ('C8.1', 3, 2, 'Calculate the probability of a single event', 'both', 3),
  ('C8.1', 4, 3, 'Understand that P(event not occurring) = 1 − P(event occurring)', 'both', 4),

  -- ── C8.2 Relative and expected frequencies ───────────────────
  ('C8.2', 1, null::integer, 'Understand relative frequency as an estimate of probability', 'both', 1),
  ('C8.2', 2, null::integer, 'Calculate expected frequencies', 'both', 2),

  -- ── C8.3 Probability of combined events ──────────────────────
  ('C8.3', 1, null::integer, 'Calculate the probability of combined events using sample space diagrams, Venn diagrams and tree diagrams', 'both', 1),

  -- ── E8.4 Conditional probability ─────────────────────────────
  ('E8.4', 1, null::integer, 'Calculate conditional probability using Venn diagrams, tree diagrams and tables', 'extended', 1),

  -- ── C9.1 Classifying statistical data ────────────────────────
  ('C9.1', 1, null::integer, 'Classify and tabulate statistical data', 'both', 1),

  -- ── C9.2 Interpreting statistical data ───────────────────────
  ('C9.2', 1, null::integer, 'Read, interpret and draw inferences from tables and statistical diagrams', 'both', 1),
  ('C9.2', 2, null::integer, 'Compare sets of data using tables, graphs and statistical measures', 'both', 2),
  ('C9.2', 3, null::integer, 'Appreciate restrictions on drawing conclusions from given data', 'both', 3),

  -- ── C9.3 Averages and range ───────────────────────────────────
  ('C9.3', 1, null::integer, 'Calculate the mean, median, mode and range for individual data and distinguish between purposes for which these are used', 'both', 1),
  ('C9.3', 2, null::integer, 'Calculate quartiles and interquartile range for individual data', 'extended', 2),
  ('C9.3', 3, null::integer, 'Calculate an estimate of the mean for grouped discrete or grouped continuous data', 'extended', 3),
  ('C9.3', 4, null::integer, 'Identify the modal class from a grouped frequency distribution', 'extended', 4),

  -- ── C9.4 Statistical charts and diagrams ─────────────────────
  ('C9.4', 1, null::integer, 'Draw and interpret bar charts including composite and dual bar charts', 'both', 1),
  ('C9.4', 2, null::integer, 'Draw and interpret pie charts', 'both', 2),
  ('C9.4', 3, null::integer, 'Draw and interpret pictograms', 'both', 3),
  ('C9.4', 4, null::integer, 'Draw and interpret stem-and-leaf diagrams', 'both', 4),
  ('C9.4', 5, null::integer, 'Draw and interpret simple frequency distributions', 'both', 5),

  -- ── C9.5 Scatter diagrams ────────────────────────────────────
  ('C9.5', 1, null::integer, 'Draw and interpret scatter diagrams', 'both', 1),
  ('C9.5', 2, null::integer, 'Understand what is meant by positive, negative and zero correlation', 'both', 2),
  ('C9.5', 3, null::integer, 'Draw by eye, interpret and use a straight line of best fit', 'both', 3),

  -- ── E9.6 Cumulative frequency diagrams ───────────────────────
  ('E9.6', 1, null::integer, 'Draw and interpret cumulative frequency tables and diagrams', 'extended', 1),
  ('E9.6', 2, null::integer, 'Estimate and interpret the median, percentiles, quartiles and interquartile range from cumulative frequency diagrams', 'extended', 2),

  -- ── E9.7 Histograms ──────────────────────────────────────────
  ('E9.7', 1, null::integer, 'Draw and interpret histograms', 'extended', 1),
  ('E9.7', 2, null::integer, 'Calculate with frequency density — frequency density = frequency ÷ class width', 'extended', 2)

) as v(ref, ext_num, core_num, outcome, tier, sort_order)
on s.ref = v.ref;

-- Expected results after running:
-- select count(*) from subtopics;           -- 72
-- select tier, count(*) from subtopics group by tier;  -- both=52, extended=20
-- select count(*) from sub_subtopics;       -- 171
