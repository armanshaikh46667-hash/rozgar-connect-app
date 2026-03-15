
-- Workers table for persistent storage
CREATE TABLE public.workers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  village TEXT NOT NULL,
  category TEXT NOT NULL,
  experience INTEGER NOT NULL DEFAULT 0,
  about TEXT NOT NULL DEFAULT '',
  photo TEXT DEFAULT '',
  service_charge TEXT DEFAULT NULL,
  price_min INTEGER DEFAULT NULL,
  price_max INTEGER DEFAULT NULL,
  availability TEXT NOT NULL DEFAULT 'Full Day',
  status TEXT NOT NULL DEFAULT 'available',
  pin TEXT NOT NULL,
  lat DOUBLE PRECISION DEFAULT NULL,
  lng DOUBLE PRECISION DEFAULT NULL,
  gallery TEXT[] DEFAULT '{}',
  ratings JSONB DEFAULT '[]',
  reviews JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can read workers" ON public.workers FOR SELECT TO public USING (true);
-- Public insert
CREATE POLICY "Anyone can create workers" ON public.workers FOR INSERT TO public WITH CHECK (true);
-- Public update
CREATE POLICY "Anyone can update workers" ON public.workers FOR UPDATE TO public USING (true);
-- Public delete
CREATE POLICY "Anyone can delete workers" ON public.workers FOR DELETE TO public USING (true);
