import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "./preview.css";

export const metadata: Metadata = {
  title: "LuxPro preview",
};

// Work-in-progress design route: exists on Vercel preview deployments and
// locally, never on production — even if this code is merged to main.
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  return children;
}
