import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NEXT_PUBLIC_ENVIRONMENT === "stage",
});

const imageHost = process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL
  ? new URL(process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL)
  : null;

const nextConfig: NextConfig = {
  reactStrictMode: process.env.NEXT_PUBLIC_ENVIRONMENT === "stage",

  images: imageHost
    ? {
        remotePatterns: [
          {
            protocol: imageHost.protocol.replace(":", "") as "http" | "https",
            hostname: imageHost.hostname,
            port: imageHost.port || "",
            pathname: "/uploads/**",
          },
        ],
      }
    : undefined,

  webpack(config) {
    config.resolve.symlinks = false;
    return config;
  },
};

export default withPWA(nextConfig);