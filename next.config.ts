import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/borrow',
        permanent: true,
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  /* config options here */
};

export default nextConfig;
