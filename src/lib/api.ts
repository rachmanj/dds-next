/**
 * API utilities for handling Sanctum authentication
 */
import axios from "axios";

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Get backend URL from environment variables with fallback
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Log configuration
console.log("API INIT - Environment variables:");
console.log("  NEXT_PUBLIC_BACKEND_URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
console.log("  Using proxy routes in Next.js config");

// Create an axios instance with default config - using proxy routes
const api = axios.create({
  baseURL: "", // Empty baseURL for proxy routes
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest", // Required for Sanctum
  },
  withCredentials: true, // Use credentials with proxy routes (same-origin)
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Construct the full URL for logging
    const fullUrl = `${
      isBrowser ? window.location.origin : "http://localhost:3000"
    }${config.url}`;

    console.log(`API Request: ${config.method?.toUpperCase()} ${fullUrl}`);
    console.log("  Headers:", JSON.stringify(config.headers));
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    // Construct the full URL for logging
    const fullUrl = `${
      isBrowser ? window.location.origin : "http://localhost:3000"
    }${response.config.url}`;

    console.log(
      `API Response Success: ${response.config.method?.toUpperCase()} ${fullUrl} - Status: ${
        response.status
      }`
    );
    return response;
  },
  (error) => {
    // Don't log 401 errors for user endpoint as they're expected when not authenticated
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.url === "/api/user"
    ) {
      console.log("User not authenticated (401 for /api/user is expected)");
      return Promise.reject(error);
    }

    // Log the error for debugging
    console.error("API Error:", error.message);
    if (error.response) {
      // Construct the full URL for logging
      const fullUrl = `${
        isBrowser ? window.location.origin : "http://localhost:3000"
      }${error.config.url}`;

      console.error(
        `Failed request to: ${error.config.method?.toUpperCase()} ${fullUrl}`
      );
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    }
    return Promise.reject(error);
  }
);

/**
 * Get CSRF token and set a cookie
 */
export async function getCsrfToken() {
  try {
    console.log("Getting CSRF token via proxy route");
    return await api.get("/sanctum/csrf-cookie");
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
    throw error;
  }
}

/**
 * Login a user using Sanctum
 */
export async function login(email: string, password: string) {
  try {
    await getCsrfToken();
    console.log("Logging in via proxy route");
    const response = await api.post("/login", { email, password });
    console.log("Login response:", response.status, response.data);
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Login error:", error);

    // Extract more detailed error information
    let errorDetails = "Unknown error occurred";
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      statusCode = error.response?.status || 500;

      if (error.response?.data) {
        // Laravel typically returns error messages in the 'message' field
        if (
          typeof error.response.data === "object" &&
          error.response.data.message
        ) {
          errorDetails = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          errorDetails = error.response.data;
        } else {
          errorDetails = JSON.stringify(error.response.data);
        }
      } else {
        errorDetails = error.message;
      }
    } else if (error instanceof Error) {
      errorDetails = error.message;
    }

    return {
      ok: false,
      error,
      statusCode,
      errorMessage: errorDetails,
    };
  }
}

/**
 * Logout the user
 */
export async function logout() {
  try {
    console.log("Logging out via proxy route");
    await api.post("/logout");
    return { ok: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { ok: false, error };
  }
}

/**
 * Get authenticated user data
 */
export async function getUser() {
  try {
    console.log("Fetching user data via proxy route");
    const { data } = await api.get("/api/user");
    console.log("User data response:", data);
    return data;
  } catch (error) {
    // This is expected for unauthenticated users
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log(
        "User not authenticated (401 response)",
        error.response.statusText
      );
      return null;
    }

    // Log other types of errors
    console.error("Get user error:", error);
    return null;
  }
}

/**
 * Test API connection status
 * Returns an object with connection status and details
 */
export async function testApiConnection() {
  try {
    console.log("Testing API connection via CSRF endpoint");
    const startTime = Date.now();
    const response = await api.get("/sanctum/csrf-cookie", { timeout: 5000 });
    const endTime = Date.now();

    return {
      success: true,
      statusCode: response.status,
      responseTime: endTime - startTime,
      message: "Successfully connected to backend API",
      cookies: document.cookie, // Show cookies for debugging
    };
  } catch (error) {
    console.error("API connection test failed:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        statusCode: error.response?.status || 0,
        message: error.message,
        details: error.response?.data || "No response data",
      };
    }

    return {
      success: false,
      message: "Unknown error occurred while testing API connection",
      error: String(error),
    };
  }
}

/**
 * Make authenticated API requests
 */
export default api;
