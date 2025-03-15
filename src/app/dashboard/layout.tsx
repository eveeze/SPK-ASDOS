// src/app/dashboard/layout.tsx
"use client";

import React, { useState } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden ml-0 lg:ml-64">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-7xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>

        <footer className="py-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="container max-w-7xl mx-auto px-4">
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Teaching Assistant Selection
              System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
