import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "books.google.com", // 許可するドメイン
      },
    ],
  },
};

export default nextConfig;
