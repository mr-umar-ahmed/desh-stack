import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next_dev' : '.next',
  /* config options here */
};

export default nextConfig;
