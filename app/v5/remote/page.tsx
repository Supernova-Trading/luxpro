import type { Metadata } from "next";
import RemotePage from "@/components/v5/remote/RemotePage";

export const metadata: Metadata = {
  title: "LuxPro Driver",
  // Added to the driver's home screen it opens as its own app (v5.38)
  manifest: "/v5/luxpro-driver.webmanifest",
};

// Amish's phone remote (roadmap P8). Same production guard as /v5 (layout).
export default function Remote() {
  return <RemotePage />;
}
