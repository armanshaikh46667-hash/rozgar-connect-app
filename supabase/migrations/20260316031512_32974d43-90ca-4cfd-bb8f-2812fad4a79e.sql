
ALTER TABLE public.digital_services ADD COLUMN IF NOT EXISTS lat double precision, ADD COLUMN IF NOT EXISTS lng double precision, ADD COLUMN IF NOT EXISTS pin text;
ALTER TABLE public.education_coaching ADD COLUMN IF NOT EXISTS lat double precision, ADD COLUMN IF NOT EXISTS lng double precision, ADD COLUMN IF NOT EXISTS pin text;
ALTER TABLE public.local_businesses ADD COLUMN IF NOT EXISTS pin text;
