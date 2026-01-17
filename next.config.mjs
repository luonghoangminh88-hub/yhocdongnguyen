/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    largePageDataBytes: 128 * 100000, // Increase from default 128KB to 12.8MB
  },
}

export default nextConfig
