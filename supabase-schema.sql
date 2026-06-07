-- ==========================================
-- HELIOX FITNESS GYM SUPABASE SCHEMA SETUP
-- Copy & paste this entire script into your Supabase SQL Editor (SQL.new)
-- ==========================================

-- 1. Create PUBLIC PROFILES table linked to Auth Users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow public read access to profiles" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow individual user update rights" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile record when a new user registers:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Valued Member')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add table trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Create MEMBERSHIP PLANS table
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  period TEXT NOT NULL,
  features TEXT[] NOT NULL,
  popular BOOLEAN DEFAULT false,
  accent_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to plans" 
  ON public.membership_plans FOR SELECT USING (true);


-- 3. Create TRAINERS table
CREATE TABLE IF NOT EXISTS public.trainers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  specialty TEXT[] NOT NULL,
  image TEXT,
  rating NUMERIC(3,2) DEFAULT 5.0,
  quote TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to trainers" 
  ON public.trainers FOR SELECT USING (true);


-- 4. Create CLASSES table
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  trainer_id TEXT REFERENCES public.trainers(id) ON DELETE SET NULL,
  trainer_name TEXT NOT NULL,
  day TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to classes" 
  ON public.classes FOR SELECT USING (true);


-- 5. Create USER SUBSCRIPTIONS table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL,
  price TEXT NOT NULL,
  start_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions" 
  ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
  ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 6. Create BOOKINGS table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  day TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow reading bookings (anybody can see active schedules, but let's restrict to users reading their own bookings and public insert)
CREATE POLICY "Allow public insert for trial requests" 
  ON public.bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read their own bookings" 
  ON public.bookings FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL OR email = auth.email());

CREATE POLICY "Users can delete their own bookings" 
  ON public.bookings FOR DELETE USING (auth.uid() = user_id OR email = auth.email());


-- 7. Create USER PROGRESS tracking table (BMI tracking and workout logs)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  weight NUMERIC(5,2) NOT NULL,
  weight_unit TEXT NOT NULL DEFAULT 'kg',
  height_str TEXT NOT NULL,
  bmi NUMERIC(4,2) NOT NULL,
  category TEXT NOT NULL,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can interact with their progress log" 
  ON public.user_progress FOR ALL USING (auth.uid() = user_id);


-- ==========================================
-- 8. SEED DATA WITH PRE-LOADED GYM PARTICULARS
-- ==========================================

-- Seed membership plans
INSERT INTO public.membership_plans (id, name, price, period, features, popular, accent_color) VALUES
('trial', 'Discovery Trial', '0', '1 Day', ARRAY['Access to all standard machine zones', '1x Consultation with General Trainer', 'Neat & Clean changing room access', 'Full locker access included', 'No sign-up fee required'], false, 'border-zinc-800 hover:border-zinc-700 font-mono'),
('monthly', 'Standard Monthly', '1,499', 'Month', ARRAY['Unlimited Gym floor access', 'All Cardio, Weight, and CrossFit zones', 'Access to standard group classes', 'General trainer assistance always', 'Zero waiting time on top equipment', 'Neat washrooms & shower access'], true, 'border-yellow-400 ring-2 ring-yellow-400/10 shadow-yellow-950/20 shadow-xl'),
('quarterly', 'Elite Quarterly', '3,799', '3 Months', ARRAY['Everything in standard tier plus:', 'Personal goals checklist', '2x Yoga/Zumba speciality classes', 'Complimentary BMI analysis & trackers', 'Saves ~15% over monthly setup', 'Discounts on premium gym merch'], false, 'border-zinc-800 hover:border-yellow-400/50'),
('annual', 'Ultimate Annual', '11,999', 'Year', ARRAY['Full premium access for 365 days', 'Unlimited CrossFit, Yoga, and Zumba', '5x Free dedicated Personal Trainer sessions', 'Free locker reservations', 'Customized nutritional diet structure', 'Flexible pause-membership option'], false, 'border-zinc-800 hover:border-yellow-400/50')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  period = EXCLUDED.period,
  features = EXCLUDED.features,
  popular = EXCLUDED.popular,
  accent_color = EXCLUDED.accent_color;

-- Seed trainers
INSERT INTO public.trainers (id, name, role, specialty, image, rating, quote) VALUES
('nikhil', 'Nikhil', 'Head CrossFit & Strength Coach', ARRAY['Olympic Lifting', 'CrossFit Levels I & II', 'Strength Conditioning'], 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=300&auto=format&fit=crop', 5.0, 'No shortcuts. Just high-quality equipment, structured work, and your willingness to start.'),
('priya', 'Priya Sen', 'Zumba & Yoga Master', ARRAY['Asana Flows', 'Zumba Certified Pro', 'Dance Fitness & HIIT'], 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=300&auto=format&fit=crop', 4.9, 'Fitness isn''t just a physical test. It''s an expression of energy, joy, and positive movement.'),
('rohit', 'Rohit Yadav', 'HIIT & General Trainer', ARRAY['Fat Loss', 'Bodyweight Conditioning', 'High Intensity Intervals'], 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop', 4.8, 'A motivated environment is half the battle won. I''m here to ensure you train safely and effectively.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  specialty = EXCLUDED.specialty,
  image = EXCLUDED.image,
  rating = EXCLUDED.rating,
  quote = EXCLUDED.quote;

-- Seed classes
INSERT INTO public.classes (id, name, trainer_id, trainer_name, day, time_slot, category) VALUES
('t1', 'HIIT exercise classes', 'rohit', 'Rohit Yadav', 'Mon', '06:30 AM - 07:30 AM', 'hiit'),
('t2', 'Crossfit Core', 'nikhil', 'Nikhil', 'Mon', '08:00 AM - 09:00 AM', 'crossfit'),
('t3', 'Weight Training guide', 'rohit', 'Rohit Yadav', 'Mon', '05:00 PM - 06:15 PM', 'weights'),
('t4', 'Zumba Energy', 'priya', 'Priya Sen', 'Mon', '07:00 PM - 08:00 PM', 'zumba'),
('t5', 'Yoga mind & stretch', 'priya', 'Priya Sen', 'Tue', '07:00 AM - 08:00 AM', 'yoga'),
('t6', 'Cycling sprints', 'rohit', 'Rohit Yadav', 'Tue', '08:30 AM - 09:30 AM', 'cycling'),
('t7', 'Dance fitness classes', 'priya', 'Priya Sen', 'Tue', '05:30 PM - 06:30 PM', 'zumba'),
('t8', 'Crossfit Pro', 'nikhil', 'Nikhil', 'Tue', '07:15 PM - 08:30 PM', 'crossfit'),
('t9', 'HIIT Cardio burn', 'rohit', 'Rohit Yadav', 'Wed', '06:30 AM - 07:30 AM', 'hiit'),
('t10', 'Aerobics Step-UP', 'priya', 'Priya Sen', 'Wed', '08:00 AM - 09:00 AM', 'hiit'),
('t11', 'Weight Training hypertrophy', 'nikhil', 'Nikhil', 'Wed', '05:30 PM - 06:45 PM', 'weights'),
('t12', 'Zumba Party', 'priya', 'Priya Sen', 'Wed', '07:00 PM - 08:00 PM', 'zumba'),
('t13', 'Yoga Balance Flow', 'priya', 'Priya Sen', 'Thu', '07:00 AM - 08:00 AM', 'yoga'),
('t14', 'Cycling stamina', 'rohit', 'Rohit Yadav', 'Thu', '08:30 AM - 09:30 AM', 'cycling'),
('t15', 'HIIT Core Blast', 'rohit', 'Rohit Yadav', 'Thu', '05:30 PM - 06:30 PM', 'hiit'),
('t16', 'Crossfit Endurance', 'nikhil', 'Nikhil', 'Thu', '07:15 PM - 08:15 PM', 'crossfit'),
('t17', 'HIIT & Power', 'rohit', 'Rohit Yadav', 'Fri', '06:30 AM - 07:30 AM', 'hiit'),
('t18', 'Aerobics Rhythm', 'priya', 'Priya Sen', 'Fri', '08:00 AM - 09:00 AM', 'zumba'),
('t19', 'Weight Training heavy', 'nikhil', 'Nikhil', 'Fri', '05:30 PM - 06:45 PM', 'weights'),
('t20', 'Dance fitness classes', 'priya', 'Priya Sen', 'Fri', '07:00 PM - 08:00 PM', 'zumba'),
('t21', 'Yoga Masterclass', 'priya', 'Priya Sen', 'Sat', '07:30 AM - 09:00 AM', 'yoga'),
('t22', 'Power Cycling', 'rohit', 'Rohit Yadav', 'Sat', '10:00 AM - 11:00 AM', 'cycling'),
('t23', 'Crossfit Weekend WOD', 'nikhil', 'Nikhil', 'Sat', '05:00 PM - 06:15 PM', 'crossfit'),
('t24', 'Zumba Weekend Dance', 'priya', 'Priya Sen', 'Sat', '06:30 PM - 07:30 PM', 'zumba')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  trainer_id = EXCLUDED.trainer_id,
  trainer_name = EXCLUDED.trainer_name,
  day = EXCLUDED.day,
  time_slot = EXCLUDED.time_slot,
  category = EXCLUDED.category;
