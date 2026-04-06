import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack(config) {
    config.resolve.symlinks = false; // 👈 CRITICAL for pnpm
    return config;
  },
};

export default withPWA(nextConfig);