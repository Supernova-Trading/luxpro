import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/components/v5/v5.css";

export const metadata: Metadata = {
  title: "LuxPro v5",
};

// LuxPro v5 lives only on the design/v2-preview branch's preview deployments.
// Even if merged by accident, it 404s on production until go-live (P7).
export default function V5Layout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  return children;
}
