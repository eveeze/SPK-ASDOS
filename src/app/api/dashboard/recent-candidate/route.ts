// src/app/api/dashboard/recent-candidates/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { candidates, assessments, courses } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    // Use a subquery approach to get the most recent assessment for each candidate
    const recentCandidates = await db
      .select({
        id: candidates.id,
        npm: candidates.npm,
        name: candidates.name,
        semester: candidates.semester,
        createdAt: candidates.createdAt,
      })
      .from(candidates)
      .orderBy(desc(candidates.createdAt))
      .limit(5);

    // Create an array to store the results with assessments
    const formattedCandidates = [];

    // For each candidate, fetch their most recent assessment (if any)
    for (const candidate of recentCandidates) {
      const latestAssessment = await db
        .select({
          id: assessments.id,
          courseId: assessments.courseId,
          courseName: courses.name,
          totalScore: assessments.totalScore,
        })
        .from(assessments)
        .leftJoin(courses, eq(assessments.courseId, courses.id))
        .where(eq(assessments.candidateId, candidate.id))
        .orderBy(desc(assessments.createdAt))
        .limit(1);

      formattedCandidates.push({
        id: candidate.id,
        npm: candidate.npm,
        name: candidate.name,
        semester: candidate.semester,
        createdAt: candidate.createdAt,
        assessment:
          latestAssessment.length > 0
            ? {
                id: latestAssessment[0].id,
                courseId: latestAssessment[0].courseId,
                courseName: latestAssessment[0].courseName,
                score: latestAssessment[0].totalScore,
              }
            : null,
      });
    }

    return NextResponse.json({
      success: true,
      data: formattedCandidates,
    });
  } catch (error) {
    console.error("Error fetching recent candidates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recent candidates" },
      { status: 500 }
    );
  }
}
