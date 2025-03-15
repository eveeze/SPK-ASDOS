// src/components/layout/header.tsx
import React from "react";
import { Bell, Menu, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type HeaderProps = {
  toggleSidebar?: () => void;
  className?: string;
};

export default function Header({ toggleSidebar, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow",
        className
      )}
    >
      <div className="flex justify-between items-center px-6 h-16">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 dark:text-gray-400 rounded-md lg:hidden hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="ml-4 lg:ml-0">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Teaching Assistant Selection System
            </h2>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button className="relative p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center">
            <div className="flex justify-center items-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="hidden ml-2 md:block">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Admin User
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                admin@example.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
