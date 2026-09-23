// Shared phone normalization/validation — the single application-layer rule
// used by both the public Availability form (portfolio-sections.tsx) and
// the dashboard's manual Add Lead form (Phase 3G.2A §3), so the two paths
// can never disagree. Deliberately country-agnostic (8–15 digits after
// stripping non-digits) rather than hardcoded to India's 10-digit mobile
// format — matches the authoritative server-side rule already enforced in
// submit_lead() (Phase 3G.1A). This is a client-side/application-layer
// convenience only; each server path still enforces its own authoritative
// check (the SQL RPC for public submissions, createLead() for manual adds)
// so a crafted request can never bypass validation by skipping this file.
export function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidPhone(value: string): boolean {
  const digits = normalizePhoneDigits(value);
  return digits.length >= 8 && digits.length <= 15;
}

export const INVALID_PHONE_MESSAGE = "Enter a valid phone number.";

/**
 * Formats a phone number for WhatsApp wa.me links.
 * WhatsApp requires an international format without + or leading zeros.
 * For 10-digit Indian numbers without country code, automatically prepends '91'.
 */
export function formatWhatsappNumber(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

