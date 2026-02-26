-- =============================================================
-- REFINING PSYCHOLOGY CATEGORIES FOR BLEPP (PH)
-- Targets: Industrial/Organizational, Abnormal, Assessment, Developmental
-- =============================================================

DO $$
BEGIN
    -- 1. DELETE all "Theories of Personality" questions
    -- (As requested: Complete removal and replacement with I/O)
    DELETE FROM public.questions
    WHERE module = 'psychology' AND category = 'Theories of Personality';

    -- 2. Create/Update Industrial/Organizational Psychology
    -- (Merging Social and I/O into this core subject)
    UPDATE public.questions
    SET category = 'Industrial/Organizational Psychology'
    WHERE module = 'psychology' AND category IN ('Social Psychology', 'I/O Psychology');

    -- 3. Research Methods is now a core target again
    -- (No changes needed, will keep existing items)

    -- 4. Standardize any remaining variants
    UPDATE public.questions
    SET category = 'Abnormal Psychology'
    WHERE module = 'psychology' AND category = 'Ethics in Psychology';

    -- 5. Link questions to profiles directly to enable Supabase Joins
    ALTER TABLE public.questions 
    DROP CONSTRAINT IF EXISTS questions_user_id_profiles_fkey;

    ALTER TABLE public.questions
    ADD CONSTRAINT questions_user_id_profiles_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id)
    ON DELETE CASCADE;

END $$;
