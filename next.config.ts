import type { NextConfig } from "next";

const noStoreHeaders = [
  {
    key: "Cache-Control",
    value: "no-store, no-cache, max-age=0, must-revalidate",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: noStoreHeaders,
      },
    ];
  },
};

export default nextConfig;
