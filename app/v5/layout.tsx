import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@/components/v5/v5.css";

// Brand option A, "Coachline" (v5.38): the LP + pinstripe icon for the browser
// tab and the tablet's home-screen shortcut (opens full screen, like an app).
export const metadata: Metadata = {
  title: "LuxPro",
  manifest: "/v5/luxpro.webmanifest",
  icons: {
    icon: [
      { url: "/v5/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/v5/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/v5/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/v5/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/v5/icon-180.png", sizes: "180x180" },
  },
};

export const viewport: Viewport = { themeColor: "#100E0B" };

// LuxPro v5 lives only on the design/v2-preview branch's preview deployments.
// Even if merged by accident, it 404s on production until go-live (P7).
export default function V5Layout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  return children;
}
