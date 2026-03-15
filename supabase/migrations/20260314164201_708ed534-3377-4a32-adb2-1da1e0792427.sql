
CREATE TABLE public.pin_reset_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile text NOT NULL,
  otp text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  used boolean NOT NULL DEFAULT false
);

ALTER TABLE public.pin_reset_otps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create OTP" ON public.pin_reset_otps FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read OTP" ON public.pin_reset_otps FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can update OTP" ON public.pin_reset_otps FOR UPDATE TO public USING (true);
