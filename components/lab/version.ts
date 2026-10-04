// LuxPro v5 — the new app being built on the design/v2-preview branch.
// Bump the minor (5.1, 5.2, …) with each iteration the owner reviews.
// The live app (main, LuxPro 4.x) is untouched and versioned separately.
export const APP_VERSION = "5.0";

// Vercel exposes the deployed commit to the client automatically; "local" in dev.
export const BUILD_ID = (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "local").slice(0, 7);
