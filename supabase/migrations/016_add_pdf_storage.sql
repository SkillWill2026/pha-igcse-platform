-- Add PDF storage columns to upload_batches table
ALTER TABLE upload_batches
ADD COLUMN source_pdf_path TEXT DEFAULT NULL,
ADD COLUMN source_file_name TEXT DEFAULT NULL;
