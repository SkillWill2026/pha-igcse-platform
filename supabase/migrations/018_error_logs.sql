CREATE TABLE IF NOT EXISTS error_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message text,
  stack text,
  url text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX error_logs_created_at_idx ON error_logs(created_at DESC);
