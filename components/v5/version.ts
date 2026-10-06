// LuxPro v5 — built only on the design/v2-preview branch. Bump the minor
// (5.2, 5.3, …) for every round the owner reviews on the tablet.
export const APP_VERSION = "5.32";

// Vercel exposes the deployed commit to the client; "local" in dev.
export const BUILD_ID = (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "local").slice(0, 7);
