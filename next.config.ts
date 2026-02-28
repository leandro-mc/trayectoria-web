import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow images from Cloudinary (for avatars and logos)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },

  // Enable strict mode for React
  reactStrictMode: true,

  // Experimental features for Next.js 15
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig
