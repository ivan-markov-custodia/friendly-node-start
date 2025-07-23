/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/weather/:path*',
        destination: 'http://api.weatherapi.com/:path*',
      },
      {
        source: '/auth-api/:path*',
        destination: 'https://lovable-backend-test-82a575c25107.herokuapp.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;