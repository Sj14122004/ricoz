/** @type {import("next").NextConfig} */
const backend = (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

module.exports = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
  },
};