-- Create families table
CREATE TABLE IF NOT EXISTS families (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loved_ones table
CREATE TABLE IF NOT EXISTS loved_ones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  birth_date DATE,
  interests TEXT[],
  hobbies TEXT[],
  clothing_size VARCHAR(50),
  shoe_size VARCHAR(50),
  favorite_colors TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  budget_limit DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gifts table
CREATE TABLE IF NOT EXISTS gifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  loved_one_id UUID NOT NULL REFERENCES loved_ones(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  purchased BOOLEAN DEFAULT FALSE,
  purchase_date DATE,
  store VARCHAR(255),
  url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create person_budget_limits table
CREATE TABLE IF NOT EXISTS person_budget_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  loved_one_id UUID NOT NULL REFERENCES loved_ones(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  budget_limit DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(loved_one_id, event_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_families_user_id ON families(user_id);
CREATE INDEX IF NOT EXISTS idx_loved_ones_family_id ON loved_ones(family_id);
CREATE INDEX IF NOT EXISTS idx_events_family_id ON events(family_id);
CREATE INDEX IF NOT EXISTS idx_gifts_loved_one_id ON gifts(loved_one_id);
CREATE INDEX IF NOT EXISTS idx_gifts_event_id ON gifts(event_id);
CREATE INDEX IF NOT EXISTS idx_person_budget_limits_loved_one_id ON person_budget_limits(loved_one_id);
CREATE INDEX IF NOT EXISTS idx_person_budget_limits_event_id ON person_budget_limits(event_id);

-- Enable Row Level Security
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE loved_ones ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_budget_limits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for families
CREATE POLICY "Users can view their own families" ON families
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own families" ON families
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own families" ON families
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own families" ON families
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for loved_ones
CREATE POLICY "Users can view loved ones from their families" ON loved_ones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM families
      WHERE families.id = loved_ones.family_id
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert loved ones into their families" ON loved_ones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM families
      WHERE families.id = loved_ones.family_id
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update loved ones from their families" ON loved_ones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM families
      WHERE families.id = loved_ones.family_id
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete loved ones from their families" ON loved_ones
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM families
      WHERE families.id = loved_ones.family_id
      AND families.user_id = auth.uid()
    )
  );

-- Create RLS policies for events
CREATE POLICY "Users can view events from their families" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM families
      WHERE families.id = events.family_id
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert events into their families" ON events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM families
      WHERE families.id = events.family_id
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update events from their families" ON events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM families
      WHERE families.id = events.family_id
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete events from their families" ON events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM families
      WHERE families.id = events.family_id
      AND families.user_id = auth.uid()
    )
  );

-- Create RLS policies for gifts
CREATE POLICY "Users can view gifts for their loved ones" ON gifts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM loved_ones
      JOIN families ON families.id = loved_ones.family_id
      WHERE loved_ones.id = gifts.loved_one_id
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert gifts for their loved ones" ON gifts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM loved_ones
      JOIN families ON families.id = loved_ones.family_id
      WHERE loved_ones.id = gifts.loved_one_id
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update gifts for their loved ones" ON gifts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM loved_ones
      JOIN families ON families.id = loved_ones.family_id
      WHERE loved_ones.id = gifts.loved_one_id
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete gifts for their loved ones" ON gifts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM loved_ones
      JOIN families ON families.id = loved_ones.family_id
      WHERE loved_ones.id = gifts.loved_one_id
      AND families.user_id = auth.uid()
    )
  );

-- Create RLS policies for person_budget_limits
CREATE POLICY "Users can view budget limits for their loved ones" ON person_budget_limits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM loved_ones
      JOIN families ON families.id = loved_ones.family_id
      WHERE loved_ones.id = person_budget_limits.loved_one_id
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert budget limits for their loved ones" ON person_budget_limits
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM loved_ones
      JOIN families ON families.id = loved_ones.family_id
      WHERE loved_ones.id = person_budget_limits.loved_one_id
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update budget limits for their loved ones" ON person_budget_limits
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM loved_ones
      JOIN families ON families.id = loved_ones.family_id
      WHERE loved_ones.id = person_budget_limits.loved_one_id
      AND families.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete budget limits for their loved ones" ON person_budget_limits
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM loved_ones
      JOIN families ON families.id = loved_ones.family_id
      WHERE loved_ones.id = person_budget_limits.loved_one_id
      AND families.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loved_ones_updated_at BEFORE UPDATE ON loved_ones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gifts_updated_at BEFORE UPDATE ON gifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_person_budget_limits_updated_at BEFORE UPDATE ON person_budget_limits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
