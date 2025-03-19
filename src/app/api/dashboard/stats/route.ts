// src/app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { candidates, courses, assessments } from "@/db/schema";
import { isNotNull, count, avg } from "drizzle-orm";

export async function GET() {
  try {
    // Count total candidates
    const totalCandidatesResult = await db
      .select({ count: count() })
      .from(candidates);

    const totalCandidates = totalCandidatesResult[0]?.count || 0;

    // Count total courses
    const totalCoursesResult = await db
      .select({ count: count() })
      .from(courses);

    const totalCourses = totalCoursesResult[0]?.count || 0;

    // Count completed assessments (those with totalScore not null)
    const completedAssessmentsResult = await db
      .select({ count: count() })
      .from(assessments)
      .where(isNotNull(assessments.totalScore));

    const completedAssessments = completedAssessmentsResult[0]?.count || 0;

    // Calculate average score from all completed assessments
    const averageScoreResult = await db
      .select({ average: avg(assessments.totalScore) })
      .from(assessments)
      .where(isNotNull(assessments.totalScore));

    // Ensure averageScore is always a number
    let averageScore = 0;
    if (
      averageScoreResult[0]?.average !== null &&
      averageScoreResult[0]?.average !== undefined
    ) {
      averageScore = Number(averageScoreResult[0].average);
    }

    return NextResponse.json({
      success: true,
      data: {
        totalCandidates,
        // Changed from activeCourses to totalCourses
        activeCourses: totalCourses,
        completedAssessments,
        averageScore,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
