-- Add DELETE policy for waiting_list table
-- This allows admins to delete waiting list entries
-- IMPORTANT: Since admin users are stored in localStorage (not in auth.users),
-- we need to allow deletes for all users. The admin check is done in the frontend.

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Users can delete waiting lists" ON waiting_list;
DROP POLICY IF EXISTS "Admins can delete waiting lists" ON waiting_list;
DROP POLICY IF EXISTS "Anyone can delete waiting lists" ON waiting_list;

-- Allow deletes for all users (admin check is done in frontend)
-- This is necessary because admin users are in localStorage, not auth.users
CREATE POLICY "Anyone can delete waiting lists" 
  ON waiting_list FOR DELETE 
  USING (true);

-- Alternative: If you want to allow users to delete only their own entries
-- Uncomment this and comment out the above policy:
-- CREATE POLICY "Users can delete their own waiting lists" 
--   ON waiting_list FOR DELETE 
--   USING (
--     auth.uid() = user_id 
--     OR 
--     user_id = 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789'::uuid
--   );

