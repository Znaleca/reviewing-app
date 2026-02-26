-- Add seen_questions column to profiles table to track encounters
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS seen_questions JSONB DEFAULT '{}'::jsonb;

-- Example structure of seen_questions:
-- {
--   "psychology": [1, 2, 3, 4],
--   "nursing": [10, 11, 12]
-- }
