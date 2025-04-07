/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['trendythreads.com'], // Add any domains you need to load images from
  },
  swcMinify: true,
};

export default nextConfig;
