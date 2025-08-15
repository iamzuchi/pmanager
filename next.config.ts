import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ protocol: "https", hostname: "k8boctpem4.ufs.sh" }],
  },
};

export default nextConfig;
