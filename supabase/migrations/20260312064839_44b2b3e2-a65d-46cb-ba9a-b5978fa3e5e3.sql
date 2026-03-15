
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_mobile text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'booking',
  is_read boolean NOT NULL DEFAULT false,
  related_booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read notifications" ON public.notifications FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can create notifications" ON public.notifications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update notifications" ON public.notifications FOR UPDATE TO public USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
