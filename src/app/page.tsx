"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
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

// Get API URL from environment variable with fallback for safety
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `${API_BASE_URL}/api/projects`;
      console.log("Fetching from:", apiUrl); // Log the URL for debugging

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data);
    } catch (err: unknown) {
      // Replace 'any' with 'unknown' for better type safety
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch projects";
      setError(errorMessage);
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
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
        <h1>Projects</h1>
        <p>Click the button below to fetch projects</p>

        <Button
          variant="destructive"
          size="lg"
          onClick={fetchProjects}
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Projects"}
        </Button>

        {error && (
          <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>
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

        {/* Dialog component is kept for reference */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Open Dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome to the jungle</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              {/* Optionally, you can add a close button or actions here */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
