-- ==========================================
-- CLEAN SLATE RESET SCRIPT
-- RUN THIS IF YOU GET A 500 ERROR
-- ==========================================

-- 1. Remove existing triggers and functions to start fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. Ensure the user_role type exists (Drop and recreate to be sure)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'examinee');
    END IF;
END $$;

-- 3. Create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role user_role DEFAULT 'examinee' NOT NULL,
  sub_role TEXT, -- 'psychology' or 'nursing'
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable RLS (Safe to run multiple times)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Re-create policies (Drop first to avoid conflicts)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6. Create the ROBUST trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  default_role user_role := 'examinee';
  metadata_role text;
BEGIN
  -- Extract role from metadata
  metadata_role := new.raw_user_meta_data->>'role';
  
  -- Validation logic
  IF metadata_role IS NULL OR NOT (metadata_role = ANY (enum_range(NULL::user_role)::text[])) THEN
    metadata_role := default_role::text;
  END IF;

  INSERT INTO public.profiles (id, full_name, role, sub_role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 
    metadata_role::user_role,
    new.raw_user_meta_data->>'sub_role'
  );
  
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Extremely safe fallback: just insert the ID and defaults
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, 'User Created (Fallback)', 'examinee');
  RETURN new;
END;
$$;

-- 7. Re-apply the trigger to the auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
