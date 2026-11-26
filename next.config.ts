import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/2023/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/2023',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;