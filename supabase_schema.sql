-- Create a custom type for user roles
CREATE TYPE user_role AS ENUM ('admin', 'examinee');

-- Create a table for public profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role user_role DEFAULT 'examinee' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Improved handle_new_user function with better error handling and defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role user_role := 'examinee';
  metadata_role text;
BEGIN
  -- Extract role from metadata, fallback to default if missing or invalid
  metadata_role := new.raw_user_meta_data->>'role';
  
  -- If metadata_role is null or not in the enum, use the default_role
  IF metadata_role IS NULL OR NOT (metadata_role = ANY (enum_range(NULL::user_role)::text[])) THEN
    metadata_role := default_role::text;
  END IF;

  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unnamed User'), 
    metadata_role::user_role
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Fallback to minimal profile if something fails
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, 'New User', 'examinee');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
