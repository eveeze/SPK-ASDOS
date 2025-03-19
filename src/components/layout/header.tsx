// src/components/layout/header.tsx
import { useEffect, useState } from "react";
import { Menu, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type HeaderProps = {
  toggleSidebar?: () => void;
  className?: string;
};

type UserData = {
  id: number;
  name: string;
  email: string;
};

export default function Header({ toggleSidebar, className }: HeaderProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/user/me");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

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
              Sistem Pemilihan Asisten Dosen
            </h2>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center">
            <div className="flex justify-center items-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="ml-2 md:block">
              {loading ? (
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : userData ? (
                <>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Halo, {userData.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {userData.email}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Admin User
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    admin@example.com
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
