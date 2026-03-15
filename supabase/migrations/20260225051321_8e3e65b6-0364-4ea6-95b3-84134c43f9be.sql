
-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_name TEXT NOT NULL,
  worker_mobile TEXT NOT NULL,
  worker_category TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_mobile TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public read/write for now (no auth)
CREATE POLICY "Anyone can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read bookings"
ON public.bookings FOR SELECT
USING (true);

CREATE POLICY "Anyone can update booking status"
ON public.bookings FOR UPDATE
USING (true);
