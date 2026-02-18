/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://dummyjson.com/:path*',
      },
    ];
  },
};

export default nextConfig;
