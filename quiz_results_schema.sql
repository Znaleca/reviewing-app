-- ==========================================
-- QUIZ RESULTS TABLE (for Leaderboards)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  module TEXT NOT NULL,          -- 'psychology' or 'nursing'
  score INTEGER NOT NULL,        -- number correct
  total_questions INTEGER NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Results are viewable by everyone." ON public.quiz_results
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert their own results." ON public.quiz_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index for fast leaderboard queries
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON public.quiz_results (user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_module ON public.quiz_results (module);
