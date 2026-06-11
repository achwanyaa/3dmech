import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    '*': [
      'public/cars/**/*',
    ],
  },
};

export default nextConfig;
