"use client";

import ProtectedComponent from "@/components/ProtectedComponent";
import UserInfo from "@/components/UserInfo";

export default function DashboardPage() {
  return (
    <ProtectedComponent>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
          <UserInfo />

          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Protected Content</h2>
            <p className="text-gray-700">
              This content is only visible to authenticated users. If you can
              see this, you are successfully authenticated with Laravel Sanctum.
            </p>
          </div>
        </div>
      </div>
    </ProtectedComponent>
  );
}
