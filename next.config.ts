import type { NextConfig } from "next";
import path from "node:path";

// __dirname is available in the CommonJS context Next.js uses to load this
// config. Since the config file is now at the repo root (with all frontend
// code), __dirname === the frontend source root.
console.log("[next.config] __dirname:", __dirname);
console.log("[next.config] process.cwd():", process.cwd());

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@": __dirname,
    };
    return config;
  },
};

export default nextConfig;
