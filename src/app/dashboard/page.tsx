// src/app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  BookOpen,
  ClipboardCheck,
  BarChart,
  Award,
  TrendingUp,
} from "lucide-react";
import StatsCard from "@/components/dashboard/stats-card";
import RecentCandidates from "@/components/dashboard/recent-candidates";
import { type StatCard } from "@/lib/types";

export default function Dashboard() {
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

        // Fetch recent candidates
        const candidatesResponse = await fetch(
          "/api/dashboard/recent-candidates"
        );
        const candidatesData = await candidatesResponse.json();

        if (candidatesData.success) {
          setRecentCandidates(candidatesData.data);
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
        <div className="w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentCandidates candidates={recentCandidates} />

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold">SAW Method Overview</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-md border">
              <h3 className="font-medium">Step 1: Define Criteria</h3>
              <p className="text-sm text-gray-600">
                The system uses 5 criteria: IPK, Programming Test, Teaching
                Ability, Reference Value, and Teamwork.
              </p>
            </div>

            <div className="p-4 rounded-md border">
              <h3 className="font-medium">Step 2: Assign Weights</h3>
              <p className="text-sm text-gray-600">
                Each criterion is assigned a weight based on its importance in
                the selection process.
              </p>
            </div>

            <div className="p-4 rounded-md border">
              <h3 className="font-medium">Step 3: Normalize Values</h3>
              <p className="text-sm text-gray-600">
                All assessment values are normalized using the SAW method to
                create a comparable scale.
              </p>
            </div>

            <div className="p-4 rounded-md border">
              <h3 className="font-medium">
                Step 4: Calculate Preference Values
              </h3>
              <p className="text-sm text-gray-600">
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
