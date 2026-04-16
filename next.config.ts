import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NEXT_PUBLIC_ENVIRONMENT === "stage",
});

const nextConfig: NextConfig = {
  reactStrictMode: process.env.NEXT_PUBLIC_ENVIRONMENT === "stage",

  webpack(config) {
    config.resolve.symlinks = false; // 👈 CRITICAL for pnpm
    return config;
  },
};

export default withPWA(nextConfig);