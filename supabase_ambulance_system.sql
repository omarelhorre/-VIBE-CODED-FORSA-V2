-- Create ambulance_availability table to track available ambulances per hospital
CREATE TABLE IF NOT EXISTS ambulance_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id TEXT NOT NULL,
  available_count INTEGER NOT NULL DEFAULT 10,
  total_count INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hospital_id)
);

-- Create ambulance_requests table to track ambulance requests
CREATE TABLE IF NOT EXISTS ambulance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id TEXT NOT NULL,
  user_id UUID,
  patient_name TEXT NOT NULL,
  location TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, dispatched, completed, rejected, revoked
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dispatched_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ambulance_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambulance_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ambulance_availability
-- Admins can view and update their hospital's availability
CREATE POLICY "Admins can view their hospital ambulance availability"
  ON ambulance_availability FOR SELECT
  USING (true);

CREATE POLICY "Admins can update their hospital ambulance availability"
  ON ambulance_availability FOR UPDATE
  USING (true);

CREATE POLICY "Admins can insert ambulance availability"
  ON ambulance_availability FOR INSERT
  WITH CHECK (true);

-- RLS Policies for ambulance_requests
-- Users can view their own requests
CREATE POLICY "Users can view their own ambulance requests"
  ON ambulance_requests FOR SELECT
  USING (auth.uid() = user_id OR true);

-- Users can create ambulance requests
CREATE POLICY "Users can create ambulance requests"
  ON ambulance_requests FOR INSERT
  WITH CHECK (true);

-- Admins can update requests for their hospital
CREATE POLICY "Admins can update ambulance requests"
  ON ambulance_requests FOR UPDATE
  USING (true);

-- Function to initialize ambulance availability for a hospital (default 10)
CREATE OR REPLACE FUNCTION initialize_ambulance_availability(hospital_id_param TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO ambulance_availability (hospital_id, available_count, total_count)
  VALUES (hospital_id_param, 10, 10)
  ON CONFLICT (hospital_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to update available count when ambulance is dispatched
CREATE OR REPLACE FUNCTION dispatch_ambulance(hospital_id_param TEXT)
RETURNS boolean AS $$
DECLARE
  current_count INTEGER;
BEGIN
  SELECT available_count INTO current_count
  FROM ambulance_availability
  WHERE hospital_id = hospital_id_param;
  
  IF current_count IS NULL THEN
    -- Initialize if doesn't exist
    INSERT INTO ambulance_availability (hospital_id, available_count, total_count)
    VALUES (hospital_id_param, 9, 10)
    ON CONFLICT (hospital_id) DO UPDATE
    SET available_count = GREATEST(0, available_count - 1),
        updated_at = NOW();
    RETURN true;
  ELSIF current_count > 0 THEN
    UPDATE ambulance_availability
    SET available_count = available_count - 1,
        updated_at = NOW()
    WHERE hospital_id = hospital_id_param;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to revoke/return ambulance
CREATE OR REPLACE FUNCTION revoke_ambulance(hospital_id_param TEXT)
RETURNS void AS $$
DECLARE
  current_count INTEGER;
  total_count INTEGER;
BEGIN
  SELECT available_count, total_count INTO current_count, total_count
  FROM ambulance_availability
  WHERE hospital_id = hospital_id_param;
  
  IF current_count IS NULL THEN
    -- Initialize if doesn't exist
    INSERT INTO ambulance_availability (hospital_id, available_count, total_count)
    VALUES (hospital_id_param, 10, 10)
    ON CONFLICT (hospital_id) DO UPDATE
    SET available_count = LEAST(total_count, available_count + 1),
        updated_at = NOW();
  ELSE
    UPDATE ambulance_availability
    SET available_count = LEAST(total_count, available_count + 1),
        updated_at = NOW()
    WHERE hospital_id = hospital_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ambulance_requests_hospital_id ON ambulance_requests(hospital_id);
CREATE INDEX IF NOT EXISTS idx_ambulance_requests_status ON ambulance_requests(status);
CREATE INDEX IF NOT EXISTS idx_ambulance_requests_user_id ON ambulance_requests(user_id);

