// src/components/layout/sidebar.tsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  Settings,
  LogOut,
  BarChart2,
  Mail,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
};

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Candidates", href: "/candidates", icon: Users },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Assessments", href: "/assessments", icon: ClipboardCheck },
    { name: "Reports", href: "/reports", icon: BarChart2 },
    { name: "Messages", href: "/messages", icon: Mail },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex flex-col w-64 h-full pt-5 pb-4 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex items-center justify-center px-4">
        <h1 className="text-xl font-bold text-blue-600">TA Selection</h1>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md group ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 ${
                    isActive
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 mt-6">
          <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50">
            <LogOut className="w-5 h-5 mr-3 text-gray-400" />
            Logout
          </button>

          <div className="pt-4 mt-6 border-t border-gray-200">
            <div className="px-4">
              <p className="text-xs font-medium text-gray-500 uppercase">
                Version
              </p>
              <p className="text-sm text-gray-600">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
