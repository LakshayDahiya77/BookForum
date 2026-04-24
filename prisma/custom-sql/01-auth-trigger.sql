-- 1. Recreate the function to include the required email field
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (id, email, name, "isAdmin")
  VALUES (
    new.id::text,
    new.email::text,
    new.raw_user_meta_data->>'name',
    false
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the old trigger to ensure a clean slate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Reattach the updated trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();