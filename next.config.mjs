/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracing: false,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'res.cloudinary.com']
  },
  // Disable static optimization for pages that need database access
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
          net: false,
          tls: false,
          dns: false,
          tty: false,
          'aws-crt': false,
          aws4: false,
          snappy: false,
          'aws-sdk': false,
          '@mongodb-js/zstd': false,
          kerberos: false,
          'mongodb-client-encryption': false
        }
      };
    }
    return config;
  },
  optimizeFonts: true,
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  generateBuildId: async () => {
    return `build-${Date.now()}`
  }
}

export default nextConfig
