-- Migration: add signup_source to beautician_profiles
-- Adds a free-text signup_source column (e.g. 'Direct', 'Expo', 'Ads').
ALTER TABLE public.beautician_profiles
  ADD COLUMN IF NOT EXISTS signup_source TEXT DEFAULT NULL;

COMMENT ON COLUMN public.beautician_profiles.signup_source IS
  'How the professional found and signed up — e.g. Direct, Expo, Ads, Seminar, Reference. Set automatically on new sign-ups; editable by admins.';
