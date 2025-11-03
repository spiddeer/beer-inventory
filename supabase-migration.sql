-- Create beers table
CREATE TABLE IF NOT EXISTS beers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brewery TEXT,
  type TEXT,
  abv DECIMAL(4, 2),
  ibu INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE beers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations on beers" ON beers
  FOR ALL
  USING (true)
  WITH CHECK (true);
