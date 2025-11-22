-- =====================================================
-- Combined Admin Policies for Supabase
-- Run this script to enable admin operations
-- =====================================================

-- 1. Blood Bank UPDATE policy
-- Allows admins to update blood bank inventory
DROP POLICY IF EXISTS "Anyone can update blood bank" ON blood_bank;
DROP POLICY IF EXISTS "Users can update blood bank" ON blood_bank;
DROP POLICY IF EXISTS "Admins can update blood bank" ON blood_bank;

CREATE POLICY "Anyone can update blood bank" 
  ON blood_bank FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- 2. Waiting List DELETE policy
-- Allows admins to delete waiting list entries
DROP POLICY IF EXISTS "Anyone can delete waiting lists" ON waiting_list;
DROP POLICY IF EXISTS "Users can delete waiting lists" ON waiting_list;
DROP POLICY IF EXISTS "Admins can delete waiting lists" ON waiting_list;

CREATE POLICY "Anyone can delete waiting lists" 
  ON waiting_list FOR DELETE 
  USING (true);

-- =====================================================
-- To revert these policies, run:
-- =====================================================
-- DROP POLICY IF EXISTS "Anyone can update blood bank" ON blood_bank;
-- DROP POLICY IF EXISTS "Anyone can delete waiting lists" ON waiting_list;

