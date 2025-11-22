-- Add UPDATE policy for blood_bank table
-- IMPORTANT: Since admin users are stored in localStorage (not in auth.users),
-- we need to allow updates for all users. The admin check is done in the frontend.
-- For production, consider moving admin users to Supabase auth with proper roles.

-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Users can update blood bank" ON blood_bank;
DROP POLICY IF EXISTS "Admins can update blood bank" ON blood_bank;
DROP POLICY IF EXISTS "Authenticated users can update blood bank" ON blood_bank;
DROP POLICY IF EXISTS "Anyone can update blood bank" ON blood_bank;

-- Allow updates for all users (admin check is done in frontend)
-- This is necessary because admin users are in localStorage, not auth.users
CREATE POLICY "Anyone can update blood bank" 
  ON blood_bank FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Option 3: Only allow admins (if admins are in auth.users with role metadata)
-- Uncomment this and comment out Option 1 if your admins are in auth.users:
-- CREATE POLICY "Admins can update blood bank" 
--   ON blood_bank FOR UPDATE 
--   USING (
--     EXISTS (
--       SELECT 1 FROM auth.users 
--       WHERE auth.users.id = auth.uid() 
--       AND (
--         auth.users.raw_user_meta_data->>'role' = 'admin' 
--         OR auth.users.raw_app_meta_data->>'role' = 'admin'
--       )
--     )
--   )
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM auth.users 
--       WHERE auth.users.id = auth.uid() 
--       AND (
--         auth.users.raw_user_meta_data->>'role' = 'admin' 
--         OR auth.users.raw_app_meta_data->>'role' = 'admin'
--       )
--     )
--   );

