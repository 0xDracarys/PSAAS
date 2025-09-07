/** @type {import('next').NextConfig} */
const nextConfig = {
  // Avoid Windows symlink errors during local builds (standalone tracing)
  outputFileTracing: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
