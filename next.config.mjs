/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['trendythreads.com', 'images.unsplash.com'], // Add Unsplash for product images
  },
  swcMinify: true,
  env: {
    // Make sure AWS credentials are available to serverless functions
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_BEDROCK_API_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_BEDROCK_API_SECRET_KEY,
  },
};

export default nextConfig;
