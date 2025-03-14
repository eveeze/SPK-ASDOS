import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { courses, criteriaWeights } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/course
export async function GET() {
  try {
    const allCourses = await db.query.courses.findMany({
      with: {
        criteriaWeights: true,
      },
    });

    return NextResponse.json(allCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, description, criteriaWeightsData } = body;

    if (!code || !name) {
      return NextResponse.json(
        { error: "Course code and name are required" },
        { status: 400 }
      );
    }

    // Check if course with code already exists
    const existingCourse = await db.query.courses.findFirst({
      where: eq(courses.code, code),
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "Course with this code already exists" },
        { status: 409 }
      );
    }

    // Create course first
    const [newCourse] = await db
      .insert(courses)
      .values({
        code,
        name,
        description,
      })
      .returning();

    // Then create criteria weights separately
    const c1Weight = criteriaWeightsData?.c1Weight ?? 3;
    const c2Weight = criteriaWeightsData?.c2Weight ?? 2;
    const c3Weight = criteriaWeightsData?.c3Weight ?? 2;
    const c4Weight = criteriaWeightsData?.c4Weight ?? 2;
    const c5Weight = criteriaWeightsData?.c5Weight ?? 3;

    const [newCriteriaWeights] = await db
      .insert(criteriaWeights)
      .values({
        courseId: newCourse.id,
        c1Weight,
        c2Weight,
        c3Weight,
        c4Weight,
        c5Weight,
      })
      .returning();

    // Combine the result
    const result = {
      ...newCourse,
      criteriaWeights: newCriteriaWeights,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
