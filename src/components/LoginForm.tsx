"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  const router = useRouter();
  const { login, user } = useAuth();

  // If user is already logged in, show a message
  if (user) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Already Logged In
        </h2>
        <p className="text-center mb-4">
          You are already logged in as {user.email}
        </p>
        <button
          onClick={() => router.push("/")}
          className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go to Home Page
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDebugInfo(null);
    setIsLoading(true);

    console.log(`Attempting to login with: ${email}`);

    try {
      const result = await login(email, password);
      console.log("Login result:", result);

      if (!result) {
        setError("Login failed with an unexpected error");
        return;
      }

      if (!result.ok) {
        // Display the specific error message if available
        if (result.errorMessage) {
          setError(result.errorMessage);
        } else {
          setError("Invalid credentials. Please try again.");
        }

        // Save debug info
        setDebugInfo(result);
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error("Login form error:", err);
      setDebugInfo(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Debug information section */}
      {debugInfo && (
        <div className="mt-4">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-sm text-gray-500 underline"
          >
            {showDebug ? "Hide debug info" : "Show debug info"}
          </button>

          {showDebug && (
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {/* Help text */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>
          Using the Laravel Sanctum authentication API at{" "}
          {process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}
        </p>
      </div>
    </div>
  );
}
