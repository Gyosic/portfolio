import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
  // allowedDevOrigins: ["*.gractor.com"],
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
