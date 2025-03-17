/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
    AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  distDir: 'out',
  // Disable static optimization for authenticated pages
  experimental: {
    // Remove any experimental features that might conflict with static export
  },
  // Configure base path if needed
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
}

module.exports = nextConfig 