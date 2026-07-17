import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-e43a8535a35b41a89a5cbb89981d3df2.r2.dev',
      },
    ],
  },
};

export default nextConfig;