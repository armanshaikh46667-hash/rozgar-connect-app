
-- Create storage bucket for about page photos
INSERT INTO storage.buckets (id, name, public) VALUES ('about-photos', 'about-photos', true);

-- Allow anyone to view photos
CREATE POLICY "Public read access for about photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'about-photos');

-- Allow anyone to upload photos (simple app, no auth)
CREATE POLICY "Public upload access for about photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'about-photos');

-- Allow anyone to update photos
CREATE POLICY "Public update access for about photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'about-photos');

-- Create a simple key-value settings table for storing the photo URL
CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for app settings"
ON public.app_settings FOR SELECT USING (true);

CREATE POLICY "Public write access for app settings"
ON public.app_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access for app settings"
ON public.app_settings FOR UPDATE USING (true);
