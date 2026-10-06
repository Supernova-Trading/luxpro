/** @type {import('next').NextConfig} */
const nextConfig = {
  // Go-live (owner approved 2026-10-06): the live address opens LuxPro v5.
  // A real server redirect (with a Location header) so every browser and
  // kiosk app follows it; app/page.tsx also redirects as a fallback.
  // The previous app (4.33) stays at /classic.
  async redirects() {
    return [{ source: "/", destination: "/v5", permanent: false }];
  },
};

export default nextConfig;
