// src/components/layout/header.tsx
import React from "react";
import { Bell, Menu, User } from "lucide-react";

type HeaderProps = {
  toggleSidebar?: () => void;
};

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex justify-between items-center px-4 h-16">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="ml-4 lg:ml-0">
            <h2 className="text-lg font-medium text-gray-900">
              Teaching Assistant Selection System
            </h2>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center">
            <div className="flex justify-center items-center w-8 h-8 bg-gray-200 rounded-full">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div className="hidden ml-2 md:block">
              <div className="text-sm font-medium text-gray-900">
                Admin User
              </div>
              <div className="text-xs text-gray-500">admin@example.com</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
