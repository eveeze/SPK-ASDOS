// components/dashboard/stats-card.tsx

import { type StatCard } from "@/lib/types";

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCard) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1">
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
          </div>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
