-- Rename answers.content_text to content for consistency with updated TypeScript types
ALTER TABLE answers RENAME COLUMN content_text TO content;
