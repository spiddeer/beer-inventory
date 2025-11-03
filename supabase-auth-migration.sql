-- Add user_id column to beers table
ALTER TABLE beers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing beers to have no owner (optional: assign to first user)
-- UPDATE beers SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;

-- Drop old permissive policy
DROP POLICY IF EXISTS "Allow all operations on beers" ON beers;

-- Create new RLS policies for authenticated users
CREATE POLICY "Users can view their own beers"
  ON beers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own beers"
  ON beers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own beers"
  ON beers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own beers"
  ON beers FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS beers_user_id_idx ON beers(user_id);
