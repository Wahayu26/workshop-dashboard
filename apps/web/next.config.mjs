/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined 
  ? process.env.NEXT_PUBLIC_BASE_PATH 
  : '/bengkelku';

const nextConfig = {
  output: 'standalone',
  basePath: basePath === '' ? undefined : basePath,
  skipTrailingSlashRedirect: true,
  reactStrictMode: true,
  transpilePackages: ['@bengkelku/shared'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.INTERNAL_API_URL || 'http://localhost:4000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
