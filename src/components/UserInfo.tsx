"use client";

import { useAuth } from "@/lib/AuthContext";

export default function UserInfo() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center p-4">Not logged in</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Welcome</h2>

      <div className="mb-6">
        <p className="text-gray-700">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <button
        onClick={logout}
        className="w-full py-2 px-4 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Logout
      </button>
    </div>
  );
}
