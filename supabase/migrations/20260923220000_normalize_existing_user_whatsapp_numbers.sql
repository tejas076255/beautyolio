-- Migration: Normalize existing phone and whatsapp numbers for old users.
-- Automatically prepends country code '91' for 10-digit Indian numbers
-- and 11-digit numbers starting with '0'.

-- 1. Update beautician_profiles.whatsapp_number for 10-digit numbers
UPDATE public.beautician_profiles
SET whatsapp_number = '91' || regexp_replace(whatsapp_number, '\D', '', 'g')
WHERE whatsapp_number IS NOT NULL
  AND length(regexp_replace(whatsapp_number, '\D', '', 'g')) = 10;

-- 2. Update beautician_profiles.whatsapp_number for 11-digit numbers starting with 0
UPDATE public.beautician_profiles
SET whatsapp_number = '91' || substring(regexp_replace(whatsapp_number, '\D', '', 'g') from 2)
WHERE whatsapp_number IS NOT NULL
  AND length(regexp_replace(whatsapp_number, '\D', '', 'g')) = 11
  AND regexp_replace(whatsapp_number, '\D', '', 'g') LIKE '0%';

-- 3. Update beautician_profiles.phone for 10-digit numbers
UPDATE public.beautician_profiles
SET phone = '91' || regexp_replace(phone, '\D', '', 'g')
WHERE phone IS NOT NULL
  AND length(regexp_replace(phone, '\D', '', 'g')) = 10;

-- 4. Update beautician_profiles.phone for 11-digit numbers starting with 0
UPDATE public.beautician_profiles
SET phone = '91' || substring(regexp_replace(phone, '\D', '', 'g') from 2)
WHERE phone IS NOT NULL
  AND length(regexp_replace(phone, '\D', '', 'g')) = 11
  AND regexp_replace(phone, '\D', '', 'g') LIKE '0%';

-- 5. Update profiles.phone for 10-digit numbers
UPDATE public.profiles
SET phone = '91' || regexp_replace(phone, '\D', '', 'g')
WHERE phone IS NOT NULL
  AND length(regexp_replace(phone, '\D', '', 'g')) = 10;

-- 6. Update profiles.phone for 11-digit numbers starting with 0
UPDATE public.profiles
SET phone = '91' || substring(regexp_replace(phone, '\D', '', 'g') from 2)
WHERE phone IS NOT NULL
  AND length(regexp_replace(phone, '\D', '', 'g')) = 11
  AND regexp_replace(phone, '\D', '', 'g') LIKE '0%';
