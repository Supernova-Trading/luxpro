import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Cormorant Garamond has no Arabic-script glyphs — Urdu content renders with
// this instead, switched in via [data-lang="ur"] in globals.css.
const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-nastaliq",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LuxPro 4.1", // v4.1.1 — auto-deploy test
  description: "Premium passenger entertainment interface",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${notoNastaliq.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
