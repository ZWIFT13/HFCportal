/** @type {import('next').NextConfig} */
module.exports = {
  experimental: { appDir: true },
  images: {
    remotePatterns: [
      {
        protocol: 'http',        // or 'https' in production
        hostname: 'localhost',    // replace with your domain
        port: '3000',             // dev port
        pathname: '/api/upload/**',
      },
    ],
  },
};