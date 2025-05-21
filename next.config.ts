/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
        }/api/:path*`,
      },
    ];
  },
  // Configure CORS settings for Sanctum
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value:
              process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
