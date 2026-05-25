import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow next/image to load Supabase Storage public URLs.
    // Replace <project>.supabase.co at runtime via the env var if you prefer
    // stricter remotePatterns.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/**" },
    ],
  },
};

export default nextConfig;
