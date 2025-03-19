// src/components/layout/sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  LogOut,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type SidebarProps = {
  isOpen: boolean;
  className?: string;
};

export default function Sidebar({ isOpen, className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Candidates", href: "/dashboard/candidates", icon: Users },
    { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
    {
      name: "Assessments",
      href: "/dashboard/assessments",
      icon: ClipboardCheck,
    },
    { name: "Calculation", href: "/dashboard/calculation", icon: BarChart2 },
  ];
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col w-64 h-full pt-6 pb-4 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 shadow transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
        className
      )}
    >
      <div className="flex items-center justify-center px-6 mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          SPK-ASDOS
        </h1>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-2">
        <nav className="px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 mr-3",
                    isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
            Logout
          </button>

          <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="px-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Make with depression
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">VERDEX</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
