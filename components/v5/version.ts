// LuxPro v5 — live since 5.44 (go-live 2026-10-06); developed on design/v2-preview. Bump the minor
// (5.2, 5.3, …) for every round the owner reviews on the tablet.
export const APP_VERSION = "5.44";

// Vercel exposes the deployed commit to the client; "local" in dev.
export const BUILD_ID = (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "local").slice(0, 7);
