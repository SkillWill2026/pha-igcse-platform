-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "answers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question_id" UUID,
    "content_text" TEXT,
    "status" TEXT DEFAULT 'draft',
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "serial_number" TEXT,
    "content" TEXT,
    "step_by_step" TEXT,
    "mark_scheme" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "ai_generated" BOOLEAN DEFAULT false,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "databank_chunks" (
    "id" UUID NOT NULL,
    "document_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector,
    "page_number" INTEGER,
    "chunk_index" INTEGER NOT NULL,
    "token_count" INTEGER,
    "created_at" TIMESTAMPTZ(6),

    CONSTRAINT "databank_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "databank_documents" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "doc_type" TEXT NOT NULL,
    "topic_id" UUID,
    "file_path" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER,
    "page_count" INTEGER,
    "chunk_count" INTEGER,
    "processing_status" TEXT NOT NULL,
    "processing_error" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "subject_id" UUID,

    CONSTRAINT "databank_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_logs" (
    "id" UUID NOT NULL,
    "message" TEXT,
    "stack" TEXT,
    "url" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6),

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_boards" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "exam_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ppt_decks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT,
    "subtopic_id" UUID,
    "status" TEXT DEFAULT 'draft',
    "slides" JSONB,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "filename" TEXT,
    "file_path" TEXT,
    "file_size" INTEGER,
    "subject_id" UUID,
    "topic_id" UUID,
    "exam_board_id" UUID,
    "tutor_notes" TEXT,

    CONSTRAINT "ppt_decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_targets" (
    "id" UUID NOT NULL,
    "total_target" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "subject_id" UUID,

    CONSTRAINT "production_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_topic_targets" (
    "id" UUID NOT NULL,
    "topic_id" UUID NOT NULL,
    "target" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "subject_id" UUID,

    CONSTRAINT "production_topic_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "role" TEXT DEFAULT 'tutor',
    "full_name" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_images" (
    "id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "storage_path" TEXT NOT NULL,
    "public_url" TEXT,
    "image_type" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL,
    "uploaded_by" UUID,
    "created_at" TIMESTAMPTZ(6),
    "display_url" TEXT,

    CONSTRAINT "question_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content_text" TEXT,
    "difficulty" TEXT,
    "marks" INTEGER,
    "topic_id" UUID,
    "subtopic_id" UUID,
    "sub_subtopic_id" UUID,
    "exam_board_id" UUID,
    "status" TEXT DEFAULT 'draft',
    "batch_id" UUID,
    "created_by" UUID,
    "has_image" BOOLEAN DEFAULT false,
    "question_number" INTEGER,
    "source_page" INTEGER,
    "year" INTEGER,
    "paper" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "serial_number" TEXT,
    "image_url" TEXT,
    "question_type" TEXT,
    "source_question_id" UUID,
    "ai_extracted" BOOLEAN DEFAULT false,
    "is_example" BOOLEAN DEFAULT false,
    "batch_position" INTEGER,
    "parent_question_ref" TEXT,
    "part_label" TEXT,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_subtopics" (
    "id" UUID NOT NULL,
    "subtopic_id" UUID NOT NULL,
    "ext_num" INTEGER NOT NULL,
    "core_num" INTEGER,
    "outcome" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "notes" TEXT,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6),

    CONSTRAINT "sub_subtopics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6),

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subtopics" (
    "id" UUID NOT NULL,
    "topic_id" UUID NOT NULL,
    "ref" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "due_date" DATE,
    "sprint_week" TEXT,
    "qs_total" INTEGER NOT NULL,
    "mcq_count" INTEGER NOT NULL,
    "short_ans_count" INTEGER NOT NULL,
    "structured_count" INTEGER NOT NULL,
    "extended_count" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "ppt_required" BOOLEAN NOT NULL,
    "examples_required" INTEGER NOT NULL,
    "tier" TEXT NOT NULL,

    CONSTRAINT "subtopics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" UUID NOT NULL,
    "ref" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtopic_count" INTEGER NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "ppt_decks" INTEGER NOT NULL,
    "completion_date" DATE,
    "hours_est" INTEGER,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "subject_id" UUID,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutor_topic_assignments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "topic_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "daily_target" INTEGER,
    "created_at" TIMESTAMPTZ(6),

    CONSTRAINT "tutor_topic_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upload_batches" (
    "id" UUID NOT NULL,
    "created_by" UUID,
    "total_files" INTEGER NOT NULL,
    "completed_files" INTEGER NOT NULL,
    "failed_files" INTEGER NOT NULL,
    "total_questions_extracted" INTEGER NOT NULL,
    "topic_id" UUID,
    "subtopic_id" UUID,
    "sub_subtopic_id" UUID,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "source_pdf_path" TEXT,
    "source_file_name" TEXT,
    "storage_path" TEXT,
    "total_questions" INTEGER,
    "questions_extracted" INTEGER,
    "error_message" TEXT,

    CONSTRAINT "upload_batches_pkey" PRIMARY KEY ("id")
);
