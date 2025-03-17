/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
    AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002', 'agreeable-coast-0f8e6080f.azurestaticapps.net']
    }
  },
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Enable static exports
  trailingSlash: true,
  // Configure base path if needed
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
}

module.exports = nextConfig 