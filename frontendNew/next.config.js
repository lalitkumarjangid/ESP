/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    BACKEND_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
