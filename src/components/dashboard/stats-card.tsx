// components/dashboard/stats-card.tsx
import { type StatCard } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface StatsCardProps extends StatCard {
  className?: string;
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-950 rounded-lg shadow p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <div className="mt-1">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
          {description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          )}
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
          <Icon className="h-6 w-6 text-gray-900 dark:text-white" />
        </div>
      </div>
    </div>
  );
}
