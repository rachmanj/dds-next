"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import api, { testApiConnection } from "@/lib/api";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Define the Project interface to match the API response
interface Project {
  id: number;
  code: string;
  owner: string;
  location: string;
  [key: string]: string | number; // Replace 'any' with more specific types
}

// Set the client-side environment indicator for debugging
console.log("=== HOME PAGE - Environment Variables ===");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- NEXT_PUBLIC_BACKEND_URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
console.log(
  "- Window location:",
  typeof window !== "undefined" ? window.location.href : "SSR"
);

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = React.useState<any>(null);
  const [testingConnection, setTestingConnection] = React.useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("===== Fetching projects via proxy route =====");

      // Use the proxy route instead of direct API call
      const response = await api.get("/api/projects");
      console.log("Projects API response received:", response.status);
      console.log("Response data:", response.data);

      setProjects(response.data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch projects";
      setError(errorMessage);
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      const result = await testApiConnection();
      setConnectionStatus(result);
    } catch (error) {
      console.error("Error testing connection:", error);
      setConnectionStatus({
        success: false,
        message: "Exception occurred during connection test",
        error: String(error),
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          maxWidth: "800px",
          width: "100%",
          padding: "1rem",
        }}
      >
        <h1 className="text-3xl font-bold">Next.js with Laravel Sanctum</h1>
        <p className="text-center max-w-md">
          This is a demo showing Next.js integration with Laravel Sanctum for
          cookie-based authentication.
        </p>

        {/* Authentication status card */}
        <div
          style={{
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginTop: "1rem",
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2 className="text-xl font-bold mb-2">Authentication Status</h2>
          {authLoading ? (
            <p>Checking authentication status...</p>
          ) : user ? (
            <div>
              <p className="text-green-600 font-bold">✅ Authenticated</p>
              <p>Logged in as: {user.email}</p>
              <p>User ID: {user.id}</p>
              <p>Name: {user.name}</p>
            </div>
          ) : (
            <p className="text-red-600">❌ Not authenticated</p>
          )}
        </div>

        <div className="flex space-x-4 mt-4">
          {!authLoading && (
            <>
              {user ? (
                <Link href="/dashboard">
                  <Button variant="default">Go to Dashboard</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="default">Login</Button>
                </Link>
              )}
            </>
          )}

          <Button
            variant="destructive"
            onClick={fetchProjects}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch Projects"}
          </Button>

          <Button
            variant="outline"
            onClick={testConnection}
            disabled={testingConnection}
          >
            {testingConnection ? "Testing..." : "Test Connection"}
          </Button>
        </div>

        {error && (
          <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>
        )}

        {connectionStatus && (
          <div
            style={{
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginTop: "1rem",
              width: "100%",
              maxWidth: "500px",
              backgroundColor: connectionStatus.success ? "#f0fff4" : "#fff5f5",
              borderColor: connectionStatus.success ? "#68d391" : "#fc8181",
            }}
          >
            <h2 className="text-xl font-bold mb-2">
              API Connection Test Results
            </h2>
            <p>
              <strong>Status:</strong>{" "}
              {connectionStatus.success ? "✅ Connected" : "❌ Failed"}
            </p>
            <p>
              <strong>Message:</strong> {connectionStatus.message}
            </p>
            {connectionStatus.statusCode && (
              <p>
                <strong>Status Code:</strong> {connectionStatus.statusCode}
              </p>
            )}
            {connectionStatus.responseTime && (
              <p>
                <strong>Response Time:</strong> {connectionStatus.responseTime}
                ms
              </p>
            )}
            {connectionStatus.cookies && (
              <p>
                <strong>Cookies:</strong> {connectionStatus.cookies}
              </p>
            )}
            {connectionStatus.details && (
              <p>
                <strong>Details:</strong>{" "}
                {typeof connectionStatus.details === "object"
                  ? JSON.stringify(connectionStatus.details)
                  : connectionStatus.details}
              </p>
            )}
            {connectionStatus.error && (
              <p>
                <strong>Error:</strong> {connectionStatus.error}
              </p>
            )}
          </div>
        )}

        {projects.length > 0 && (
          <div style={{ marginTop: "2rem", width: "100%" }}>
            <h2>Project List ({projects.length})</h2>
            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              }}
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "1rem",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{project.code}</h3>
                    <span
                      style={{
                        backgroundColor: "#e0e0e0",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                      }}
                    >
                      ID: {project.id}
                    </span>
                  </div>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Owner:</strong> {project.owner}
                  </p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Location:</strong> {project.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backend Connection Test */}
        <div
          style={{
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginTop: "2rem",
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2 className="text-xl font-bold mb-2">Backend Connection</h2>
          <p>
            <strong>Environment:</strong> {process.env.NODE_ENV}
          </p>
          <p>
            <strong>Backend URL:</strong>{" "}
            {process.env.NEXT_PUBLIC_BACKEND_URL || "Using fallback URL"}
          </p>
          <p>
            <strong>Frontend URL:</strong>{" "}
            {typeof window !== "undefined" ? window.location.origin : "SSR"}
          </p>
        </div>
      </div>
    </div>
  );
}
