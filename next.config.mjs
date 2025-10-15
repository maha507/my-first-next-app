/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure edge runtime is properly configured
  experimental: {
    runtime: 'experimental-edge',
  },
};

export default nextConfig;
