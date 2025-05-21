/** @type {import('next').NextConfig} */

// Log environment variables for debugging
console.log("=== Next.js Config - Environment Variables ===");
console.log("NEXT_PUBLIC_BACKEND_URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

// Use the environment variable with fallback
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
console.log("Using BACKEND_URL:", BACKEND_URL);

const nextConfig = {
  // No need to set env, Next.js automatically loads environment variables from .env files

  // Set up API routes to proxy requests to the backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: "/sanctum/:path*",
        destination: `${BACKEND_URL}/sanctum/:path*`,
      },
      {
        source: "/login",
        destination: `${BACKEND_URL}/login`,
      },
      {
        source: "/logout",
        destination: `${BACKEND_URL}/logout`,
      },
    ];
  },
};

module.exports = nextConfig;
