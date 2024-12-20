import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    domains: ["node101.s3.eu-central-1.amazonaws.com"],
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
