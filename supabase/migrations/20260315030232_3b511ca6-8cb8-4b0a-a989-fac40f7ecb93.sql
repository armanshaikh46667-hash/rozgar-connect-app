
CREATE TABLE public.digital_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_name TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  service_type TEXT NOT NULL,
  village TEXT NOT NULL,
  address TEXT,
  description TEXT,
  photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.digital_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read digital services" ON public.digital_services FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can create digital services" ON public.digital_services FOR INSERT TO public WITH CHECK (true);

CREATE TABLE public.education_coaching (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_name TEXT NOT NULL,
  institute_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  course_type TEXT NOT NULL,
  village TEXT NOT NULL,
  address TEXT,
  description TEXT,
  photo TEXT,
  fees TEXT,
  timing TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.education_coaching ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read education coaching" ON public.education_coaching FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can create education coaching" ON public.education_coaching FOR INSERT TO public WITH CHECK (true);
