// Server-only. Secure without-OTP password reset for phone-registered accounts.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) return trimmed.replace(/\s/g, "");
  return `+91${trimmed.replace(/\D/g, "")}`;
}

function phoneToFakeEmail(normalizedPhone: string): string {
  const digits = normalizedPhone.replace(/^\+/, "");
  return `${digits}@beuati.app`;
}

export type ResetPasswordWithoutOtpInput = {
  phone: string;
  name: string;
  newPassword: string;
};

export async function resetPasswordWithoutOtp(
  input: ResetPasswordWithoutOtpInput,
): Promise<{ success: boolean; message: string }> {
  const rawDigits = input.phone.replace(/\D/g, "");
  if (!rawDigits || rawDigits.length < 10) {
    throw new Error("Please enter a valid 10-digit phone number.");
  }

  const trimmedName = input.name.trim().toLowerCase();
  if (!trimmedName || trimmedName.length < 2) {
    throw new Error("Please enter your registered name.");
  }

  if (!input.newPassword || input.newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters.");
  }

  const normalizedPhone = normalizePhone(input.phone);
  const fakeEmail = phoneToFakeEmail(normalizedPhone);

  // 1. Look up profile matching phone or derived internal email
  const { data: profiles, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, auth_user_id, display_name, phone, email")
    .or(
      `phone.eq.${normalizedPhone},phone.eq.+${rawDigits},phone.eq.${rawDigits},email.eq.${fakeEmail}`,
    );

  if (profileError) {
    console.error("[password-reset] Profile lookup failed:", profileError);
    throw new Error("Account verification failed. Please try again.");
  }

  let authUserId: string | null = null;

  // Check matching profile by name
  const matchingProfile = (profiles ?? []).find((p) => {
    const profileName = (p.display_name ?? "").trim().toLowerCase();
    return (
      profileName === trimmedName ||
      profileName.includes(trimmedName) ||
      trimmedName.includes(profileName)
    );
  });

  if (matchingProfile) {
    authUserId = matchingProfile.auth_user_id;
  } else {
    // 2. Fallback check: beautician_profiles table
    const { data: bps, error: bpError } = await supabaseAdmin
      .from("beautician_profiles")
      .select("id, profile_id, display_name, phone, whatsapp_number")
      .or(
        `phone.eq.${normalizedPhone},phone.eq.+${rawDigits},phone.eq.${rawDigits},whatsapp_number.eq.${normalizedPhone},whatsapp_number.eq.+${rawDigits},whatsapp_number.eq.${rawDigits}`,
      );

    if (!bpError && bps && bps.length > 0) {
      const matchingBp = bps.find((b) => {
        const bpName = (b.display_name ?? "").trim().toLowerCase();
        return (
          bpName === trimmedName ||
          bpName.includes(trimmedName) ||
          trimmedName.includes(bpName)
        );
      });

      if (matchingBp) {
        const { data: linkedProfile } = await supabaseAdmin
          .from("profiles")
          .select("id, auth_user_id")
          .eq("id", matchingBp.profile_id)
          .maybeSingle();

        if (linkedProfile?.auth_user_id) {
          authUserId = linkedProfile.auth_user_id;
        }
      }
    }
  }

  if (!authUserId) {
    throw new Error(
      "No account found matching this phone number and registered name. Please check your details.",
    );
  }

  // 3. Update the password directly via Supabase Admin Auth
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(authUserId, {
    password: input.newPassword,
  });

  if (updateError) {
    console.error("[password-reset] Admin password update failed:", updateError);
    throw new Error(updateError.message || "Failed to update password. Please try again.");
  }

  return { success: true, message: "Password updated successfully! Please sign in." };
}
