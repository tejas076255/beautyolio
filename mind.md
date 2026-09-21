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
- **Change**: In `updateProfileForProfile`, removed the pre-flight `SELECT id FROM beautician_profiles` check prior to running the `UPDATE` query.
- **Impact**: Eliminates an unnecessary DB roundtrip every time an onboarding step (Step 1, Step 2, Step 3) is saved.
