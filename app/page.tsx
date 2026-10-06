import { redirect } from "next/navigation";

// Go-live (P7, owner approved 2026-10-06): the live address opens LuxPro v5.
// The previous app (4.33) stays at /classic as a fallback.
export default function Home() {
  redirect("/v5");
}
