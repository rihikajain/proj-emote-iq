/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Ignore ESLint errors during production build
    esmExternals: true,
  },
};

module.exports = nextConfig;
