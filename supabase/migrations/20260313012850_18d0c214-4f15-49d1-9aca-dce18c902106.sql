
-- Local business listings table
CREATE TABLE public.local_businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  mobile text NOT NULL,
  village text NOT NULL,
  address text,
  description text,
  photo text,
  lat double precision,
  lng double precision,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.local_businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read businesses" ON public.local_businesses FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can create businesses" ON public.local_businesses FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update businesses" ON public.local_businesses FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete businesses" ON public.local_businesses FOR DELETE TO public USING (true);

-- Insert some seed data
INSERT INTO public.local_businesses (name, category, mobile, village, description) VALUES
  ('Sharma Hardware', 'Hardware Shop', '9876500001', 'Salmkhedi', 'सभी प्रकार की हार्डवेयर सामग्री उपलब्ध'),
  ('Gupta Medical Store', 'Medical Store', '9876500002', 'Sonkatch', '24 घंटे खुली दवाई की दुकान'),
  ('Patel Cement Supply', 'Cement Supplier', '9876500003', 'Dewas', 'सीमेंट, रेत, ईंट - सस्ते दाम'),
  ('Singh Kirana Store', 'Kirana Store', '9876500004', 'Salmkhedi', 'रोज़मर्रा का सामान'),
  ('Modern Furniture', 'Furniture Shop', '9876500005', 'Sonkatch', 'कस्टम फर्नीचर बनवाएं');
