/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    largePageDataBytes: 128 * 1000000,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "access-control-allow-origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
