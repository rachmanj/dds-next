"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

interface ProtectedComponentProps {
  children: React.ReactNode;
}

export default function ProtectedComponent({
  children,
}: ProtectedComponentProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  // If we have a user, render the protected content
  return user ? <>{children}</> : null;
}
