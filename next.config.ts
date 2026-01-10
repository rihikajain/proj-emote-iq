/** @type {import('next').NextConfig} */
const nextConfig = {
  
  experimental: {
    // Ignore ESLint errors during production build
    esmExternals: true,
  },
};

module.exports = nextConfig;
