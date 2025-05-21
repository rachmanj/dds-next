import { NextRequest, NextResponse } from "next/server";

// Get Laravel backend URL from environment variables
const LARAVEL_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Log the backend URL to verify it's correctly set
console.log("Laravel Backend URL:", LARAVEL_URL);

export async function GET(
  request: NextRequest,
  context: { params: { proxy: string[] } }
) {
  return await proxyRequest(request, context.params.proxy);
}

export async function POST(
  request: NextRequest,
  context: { params: { proxy: string[] } }
) {
  return await proxyRequest(request, context.params.proxy);
}

export async function PUT(
  request: NextRequest,
  context: { params: { proxy: string[] } }
) {
  return await proxyRequest(request, context.params.proxy);
}

export async function DELETE(
  request: NextRequest,
  context: { params: { proxy: string[] } }
) {
  return await proxyRequest(request, context.params.proxy);
}

export async function PATCH(
  request: NextRequest,
  context: { params: { proxy: string[] } }
) {
  return await proxyRequest(request, context.params.proxy);
}

export async function OPTIONS(
  request: NextRequest,
  context: { params: { proxy: string[] } }
) {
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
async function proxyRequest(request: NextRequest, proxyParts: string[]) {
  const url = new URL(request.url);
  const path = proxyParts.join("/");
  const targetUrl = `${LARAVEL_URL}/${path}${url.search}`;

  console.log("Proxying request to:", targetUrl);

  try {
    const requestHeaders = new Headers(request.headers);

    // Forward cookies for Laravel Sanctum
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: requestHeaders,
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? await request.blob()
          : undefined,
      credentials: "include",
    });

    // Get all headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    // Ensure we can proxy cookies from Laravel
    responseHeaders.set("Access-Control-Allow-Credentials", "true");
    responseHeaders.set("Access-Control-Allow-Origin", url.origin);

    // Build the response with the data and headers
    const responseData = await response.blob();

    return new NextResponse(responseData, {
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
