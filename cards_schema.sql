-- ==========================================
-- QUESTIONS / FLASHCARDS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE DEFAULT auth.uid() NOT NULL,
  question TEXT NOT NULL,
  choice_a TEXT NOT NULL,
  choice_b TEXT NOT NULL,
  choice_c TEXT NOT NULL,
  choice_d TEXT NOT NULL,
  correct_answer INTEGER NOT NULL, -- 0:A, 1:B, 2:C, 3:D
  explanation TEXT,
  category TEXT NOT NULL,
  module TEXT NOT NULL, -- 'psychology' or 'nursing'
  CONSTRAINT valid_correct_answer CHECK (correct_answer >= 0 AND correct_answer <= 3)
);

-- Enable Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Questions are viewable by everyone." ON public.questions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create questions." ON public.questions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own questions." ON public.questions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own questions." ON public.questions
  FOR DELETE USING (auth.uid() = user_id);
