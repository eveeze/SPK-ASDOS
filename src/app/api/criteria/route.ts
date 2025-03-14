import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { criteriaWeights, courses } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/criteria - Get all criteria weights
export async function GET() {
  try {
    const allCriteriaWeights = await db.query.criteriaWeights.findMany({
      with: {
        course: true,
      },
    });

    return NextResponse.json(allCriteriaWeights);
  } catch (error) {
    console.error("Error fetching criteria weights:", error);
    return NextResponse.json(
      { error: "Failed to fetch criteria weights" },
      { status: 500 }
    );
  }
}

// POST /api/criteria - Create a new criteria weight
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, c1Weight, c2Weight, c3Weight, c4Weight, c5Weight } = body;

    // Validate input
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if course exists
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if criteria weights already exist for this course
    const existingCriteria = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.courseId, courseId),
    });

    if (existingCriteria) {
      return NextResponse.json(
        { error: "Criteria weights already exist for this course" },
        { status: 409 }
      );
    }

    const newCriteriaWeights = await db
      .insert(criteriaWeights)
      .values({
        courseId,
        c1Weight: c1Weight ?? 3,
        c2Weight: c2Weight ?? 2,
        c3Weight: c3Weight ?? 2,
        c4Weight: c4Weight ?? 2,
        c5Weight: c5Weight ?? 3,
      })
      .returning();

    return NextResponse.json(newCriteriaWeights[0], { status: 201 });
  } catch (error) {
    console.error("Error creating criteria weights:", error);
    return NextResponse.json(
      { error: "Failed to create criteria weights" },
      { status: 500 }
    );
  }
}