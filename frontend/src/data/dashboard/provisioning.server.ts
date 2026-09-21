// Server-only. Ensures a brand-new signup ends up with an editable (draft)
// beautician_profiles row instead of the Builder erroring out with
// "No portfolio found for the current account". RLS's bp_owner_insert
// policy already allows an authenticated user to insert a row scoped to
// their own profiles.id — this file only decides *what* to insert.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/integrations/supabase/types";
import { slugify } from "@/lib/slugify";

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

export async function ensureOwnPortfolio(
  supabase: SupabaseClient<Database>,
  userId: string,
  signupSource?: string,
): Promise<{ slug: string; created: boolean; profile: Tables<"beautician_profiles"> }> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, email, phone")
    .eq("auth_user_id", userId)
    .single();

  if (profileError || !profile) {
    throw new Error("No account profile found for the current session.");
  }

  const { data: existing, error: existingError } = await supabase
    .from("beautician_profiles")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Failed to check for an existing portfolio: ${existingError.message}`);
  }
  if (existing) {
    // Billing Phase A: reconcile commercial state on every dashboard visit.
    // Executed asynchronously in background so response is not delayed.
    (async () => {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        if (existing.status === "draft") {
          await supabaseAdmin
            .from("beautician_profiles")
            .update({ status: "published" })
            .eq("id", existing.id);
        }
        const { reconcileCommercialState } = await import("@/data/billing/commercial-state.server");
        await reconcileCommercialState(supabaseAdmin, existing.id);
      } catch (err) {
        console.error(
          `[provisioning] commercial-state reconciliation failed for profile ${existing.id}`,
          err,
        );
      }
    })();
    return { slug: existing.slug, created: false, profile: existing };
  }

  const displayName = profile.display_name?.trim() || profile.email?.split("@")[0] || "beautician";
  const baseSlug = slugify(displayName) || "beautician";

  for (let attempt = 0; attempt < 5; attempt++) {
    const candidateSlug = attempt === 0 ? baseSlug : `${baseSlug}-${randomSuffix()}`;
    const { data: created, error: insertError } = await supabase
      .from("beautician_profiles")
      .insert({
        profile_id: profile.id,
        slug: candidateSlug,
        display_name: displayName,
        status: "published",
        // Pre-fill phone from profiles so it's immediately available
        // in the dashboard without requiring the user to go through
        // onboarding first.
        ...(profile.phone ? { phone: profile.phone, whatsapp_number: profile.phone } : {}),
      })
      .select("*")
      .single();

    if (!insertError && created) {
      return { slug: created.slug, created: true, profile: created };
    }

    // 23505 = unique_violation (slug already taken) — retry with a suffix.
    if (insertError && insertError.code !== "23505") {
      throw new Error(`Failed to create portfolio: ${insertError.message}`);
    }
  }

  throw new Error("Could not generate a unique portfolio URL — please try again.");
}
