# Onboarding Performance Optimizations

## Overview
Optimized the onboarding submission and initial page load speed by removing blocking server calls and reducing unnecessary database roundtrips.

## Key Changes Made

### 1. Non-blocking Commercial State Reconciliation
- **File**: `frontend/src/data/dashboard/provisioning.server.ts`
- **Change**: Converted `reconcileCommercialState(...)` execution inside `ensureOwnPortfolio` into a non-blocking asynchronous background operation.
- **Impact**: Prevents RPC timeouts and database roundtrips from delaying initial onboarding and dashboard context loads.

### 2. Reduced Database Queries in Onboarding Context (`getOnboardingContextFn`)
- **Files**:
  - `frontend/src/data/dashboard/provisioning.server.ts`
  - `frontend/src/routes/onboarding.tsx`
- **Change**: `ensureOwnPortfolio` now returns the full `beautician_profiles` record (`select("*")`). `getOnboardingContextFn` reuses this record directly instead of making 3 subsequent queries (`getOwnBeauticianProfileId` + `getProfileForProfile`).
- **Impact**: Reduced database roundtrips on page initialization from **5 sequential queries down to 2**.

### 3. Removed Redundant `SELECT` Query Before Profile Updates
- **File**: `frontend/src/data/dashboard/profile.server.ts`
- **Change**: In `updateProfileForProfile`, removed the pre-flight `SELECT id` query prior to running the `UPDATE` query.
- **Impact**: Eliminates an unnecessary DB roundtrip every time an onboarding step (Step 1, Step 2, Step 3) is saved.

---

## Default Profile Avatar (No-Photo Fallback)

### Problem
When a user doesn't upload a profile photo, the public portfolio hero section showed a plain gradient background with a Sparkles icon — looked empty and unprofessional.

### Change
- **File**: `frontend/src/components/portfolio/portfolio-sections.tsx` (PortfolioHeroSection)
- **Change**: Replaced the gradient+Sparkles `<div>` fallback with a proper default avatar image (`/default-profile-avatar.jpg`) — a professional silhouette placeholder matching the BeautyFolio brand colors.
- **Asset**: `frontend/public/default-profile-avatar.jpg` — new file added.

---

## Admin Role Assignment

### Account
- **Phone Number**: `8200623024` (`918200623024@beuati.app`)
- **User ID**: `8ade1a3b-c80c-48b2-b868-e0271ef82854`

### Change
- Added `admin` role entry to `user_roles` table in Supabase for user `8200623024`.
- User can now log in and access the `/admin` console dashboard.

