import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../preview/preview.css";
import "./lab.css";

export const metadata: Metadata = {
  title: "LuxPro — pick a direction",
};

// Design mockups for the owner to compare on the tablet. Never on production.
export default function LabLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  return children;
}
