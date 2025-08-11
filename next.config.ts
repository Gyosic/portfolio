import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
  allowedDevOrigins: ["*.gyolab.com"],
  experimental: {
    authInterrupts: true,
    // ppr: "incremental",
  },
};

export default nextConfig;
