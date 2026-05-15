import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@react-pdf/renderer"],
};

export default nextConfig;
