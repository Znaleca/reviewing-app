-- ==========================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Consolidates psychology sub-topics into
-- 4 main BLEPP categories
-- ==========================================

-- Social Psychology → Theories of Personality
UPDATE public.questions
SET category = 'Theories of Personality'
WHERE module = 'psychology'
  AND category = 'Social Psychology';

-- I/O Psychology → Theories of Personality
UPDATE public.questions
SET category = 'Theories of Personality'
WHERE module = 'psychology'
  AND category = 'Industrial/Organizational Psychology';

-- Ethics → Psychological Assessment
UPDATE public.questions
SET category = 'Psychological Assessment'
WHERE module = 'psychology'
  AND category = 'Ethics in Psychology';

