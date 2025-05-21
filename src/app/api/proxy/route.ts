import { NextRequest, NextResponse } from "next/server";

// Get Laravel backend URL from environment variables with forced loading from .env
const LARAVEL_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Debug log
console.log("API PROXY: Using Laravel URL:", LARAVEL_URL);

export async function GET(request: NextRequest) {
  return await proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return await proxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return await proxyRequest(request);
}

export async function DELETE(request: NextRequest) {
  return await proxyRequest(request);
}

export async function PATCH(request: NextRequest) {
  return await proxyRequest(request);
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept",
      "Access-Control-Max-Age": "86400",
    },
  });
}

// Proxy function to forward requests to Laravel
async function proxyRequest(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Remove /api/proxy from the path
    let pathToForward = pathname.replace(/^\/api\/proxy/, "");

    // If the path is empty, use a slash
    if (!pathToForward) {
      pathToForward = "/";
    }

    // Full URL to the Laravel backend
    const targetUrl = `${LARAVEL_URL}${pathToForward}${url.search}`;

    console.log(`PROXY REQUEST: ${request.method} ${pathname} → ${targetUrl}`);

    // Copy request headers
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      headers.set(key, value);
    });

    // Add necessary headers for Sanctum
    headers.set("X-Requested-With", "XMLHttpRequest");
    headers.set("Accept", "application/json");

    // Forward request to Laravel
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? await request.text()
          : undefined,
      credentials: "include",
    });

    // Create response headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    // Ensure CORS headers
    responseHeaders.set("Access-Control-Allow-Origin", url.origin);
    responseHeaders.set("Access-Control-Allow-Credentials", "true");

    // Get response body
    const responseBody = await response.text();

    console.log(`PROXY RESPONSE: ${response.status} ${response.statusText}`);

    // Create and return response
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request to Laravel" },
      { status: 500 }
    );
  }
}
