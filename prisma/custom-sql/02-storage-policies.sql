-- 1. Clean up old/broken policies to prevent duplicates on reset
DROP POLICY IF EXISTS "Admins can insert into admin buckets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update admin buckets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete from admin buckets" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own profile" ON public."User";

-- 2. PUBLIC READ ACCESS (Allows <img src="..." /> to work)
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id IN ('book-covers', 'author-photos', 'category-icons', 'avatars') );

-- 3. AVATARS (Authenticated Users Only)
CREATE POLICY "Users can upload their own avatars" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK ( bucket_id = 'avatars' AND auth.uid() = owner );

CREATE POLICY "Users can update their own avatars" 
ON storage.objects FOR UPDATE TO authenticated 
USING ( bucket_id = 'avatars' AND auth.uid() = owner );

CREATE POLICY "Users can delete their own avatars" 
ON storage.objects FOR DELETE TO authenticated 
USING ( bucket_id = 'avatars' AND auth.uid() = owner );

-- 4. ADMIN BUCKETS (Admins Only)
CREATE POLICY "Admins can insert into admin buckets" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (
  bucket_id IN ('book-covers', 'author-photos', 'category-icons') AND 
  EXISTS (SELECT 1 FROM public."User" WHERE public."User".id::text = auth.uid()::text AND public."User"."isAdmin" = true)
);

CREATE POLICY "Admins can update admin buckets" 
ON storage.objects FOR UPDATE TO authenticated 
USING (
  bucket_id IN ('book-covers', 'author-photos', 'category-icons') AND 
  EXISTS (SELECT 1 FROM public."User" WHERE public."User".id::text = auth.uid()::text AND public."User"."isAdmin" = true)
);

CREATE POLICY "Admins can delete from admin buckets" 
ON storage.objects FOR DELETE TO authenticated 
USING (
  bucket_id IN ('book-covers', 'author-photos', 'category-icons') AND 
  EXISTS (SELECT 1 FROM public."User" WHERE public."User".id::text = auth.uid()::text AND public."User"."isAdmin" = true)
);

-- 5. PRISMA USER TABLE RLS (Required for the Admin EXISTS check to work)
-- Re-enable RLS in case the table was dropped and recreated during a reset
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" 
ON public."User" FOR SELECT TO authenticated 
USING (id::text = auth.uid()::text);