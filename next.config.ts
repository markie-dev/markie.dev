import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lastfm.freetls.fastly.net'],
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/webp'],
  },
};

export default nextConfig;
