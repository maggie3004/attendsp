import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Image optimization — allow remote patterns from cloud storage providers
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },

  // These packages must run on the server only (not bundled into the client)
  // Required for Prisma and bcryptjs to work correctly in Next.js 16
  serverExternalPackages: ['@prisma/client', 'bcryptjs', 'face-api.js'],

  // Required headers for PWA and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Allow face-api.js model files to be served from public
        source: '/models/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
