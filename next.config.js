/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Optimize images for Vercel
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // Output configuration for Vercel
  output: 'standalone',
}

module.exports = nextConfig

