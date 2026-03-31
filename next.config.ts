import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.cdninstagram.com", pathname: "/**" },
      { protocol: "https", hostname: "*.fbcdn.net", pathname: "/**" },
    ],
  },
};

export default nextConfig;
