// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Users,
  BookOpen,
  ClipboardCheck,
  BarChart,
  Award,
  TrendingUp,
  LogOut,
} from "lucide-react";
import StatsCard from "@/components/dashboard/stats-card";
import RecentCandidates from "@/components/dashboard/recent-candidates";
import { type StatCard } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: "Total Candidates",
      value: 0,
      description: "All registered candidates",
      icon: Users,
    },
    {
      title: "Active Courses",
      value: 0,
      description: "Courses with open positions",
      icon: BookOpen,
    },
    {
      title: "Completed Assessments",
      value: 0,
      description: "Processed evaluations",
      icon: ClipboardCheck,
    },
    {
      title: "Average Score",
      value: "0.0",
      description: "Among all candidates",
      icon: BarChart,
    },
  ]);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth-test");
        if (!res.ok) {
          // Not authenticated, redirect to login
          router.push("/login");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const statsResponse = await fetch("/api/dashboard/stats");
        const statsData = await statsResponse.json();

        if (statsData.success) {
          setStats([
            {
              title: "Total Candidates",
              value: statsData.data.totalCandidates,
              description: "All registered candidates",
              icon: Users,
            },
            {
              title: "Active Courses",
              value: statsData.data.activeCourses,
              description: "Courses with open positions",
              icon: BookOpen,
            },
            {
              title: "Completed Assessments",
              value: statsData.data.completedAssessments,
              description: "Processed evaluations",
              icon: Award,
            },
            {
              title: "Average Score",
              value: statsData.data.averageScore.toFixed(1),
              description: "Among all candidates",
              icon: TrendingUp,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-b-2 border-gray-600 dark:border-gray-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              SAW Method Calculation Details
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-md border border-gray-200 dark:border-gray-800">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Formula for Normalization
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                For benefit criteria: r<sub>ij</sub> = X<sub>ij</sub> / Max(X
                <sub>i</sub>)
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                For cost criteria: r<sub>ij</sub> = Min(X<sub>i</sub>) / X
                <sub>ij</sub>
              </p>
            </div>

            <div className="p-4 rounded-md border border-gray-200 dark:border-gray-800">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Weight Distribution
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                • IPK (C1): 3 points - High importance
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                • Programming Test (C2): 2 points - Medium importance
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                • Teaching Ability (C3): 2 points - Medium importance
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                • Reference Value (C4): 2 points - Medium importance
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                • Teamwork (C5): 3 points - High importance
              </p>
            </div>

            <div className="p-4 rounded-md border border-gray-200 dark:border-gray-800">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Preference Value Calculation
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                V<sub>i</sub> = Σ w<sub>j</sub> × r<sub>ij</sub>
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                The candidate with the highest V<sub>i</sub> value is
                recommended as the best teaching assistant candidate for the
                selected course.
              </p>
            </div>

            <div className="p-4 rounded-md border border-gray-200 dark:border-gray-800">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Criteria Rating Scale
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                All criteria are rated on a scale of 1-5:
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                • 5: Excellent (86-100 score or IPK 3.81-4.00)
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                • 4: Very Good (76-85 score or IPK 3.51-3.80)
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                • 3: Good (66-75 score or IPK 3.31-3.50)
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                • 2: Fair (51-65 score or IPK 3.00-3.30)
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                • 1: Poor (≤50 score or IPK &lt;3.00)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              SAW Method Overview
            </h3>
          </div>

          <div className="p-6 space-y-4">
            <div className="p-4 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Step 1: Define Criteria
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                The system uses 5 criteria: IPK, Programming Test, Teaching
                Ability, Reference Value, and Teamwork.
              </p>
            </div>

            <div className="p-4 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Step 2: Assign Weights
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Each criterion is assigned a weight based on its importance in
                the selection process.
              </p>
            </div>

            <div className="p-4 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Step 3: Normalize Values
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                All assessment values are normalized using the SAW method to
                create a comparable scale.
              </p>
            </div>

            <div className="p-4 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Step 4: Calculate Preference Values
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Final scores are calculated as the sum of normalized values
                multiplied by their respective weights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
