import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { criteriaWeights } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/criteria/course/[courseId] - Get criteria weights by course ID
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = parseInt(params.courseId);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const criteriaWeight = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.courseId, courseId),
      with: {
        course: true,
      },
    });

    if (!criteriaWeight) {
      return NextResponse.json(
        { error: "Criteria weights not found for this course" },
        { status: 404 }
      );
    }

    return NextResponse.json(criteriaWeight);
  } catch (error) {
    console.error("Error fetching criteria weights:", error);
    return NextResponse.json(
      { error: "Failed to fetch criteria weights" },
      { status: 500 }
    );
  }
}
