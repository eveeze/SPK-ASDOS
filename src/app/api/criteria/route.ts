// app/api/criteria/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { criteriaWeights, courses } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET all criteria weights
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const courseId = searchParams.get("courseId");

    let query = db.query.criteriaWeights.findMany({
      with: {
        course: {
          columns: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Apply filter if courseId is provided
    if (courseId) {
      query = db.query.criteriaWeights.findMany({
        where: eq(criteriaWeights.courseId, parseInt(courseId)),
        with: {
          course: {
            columns: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      });
    }

    const result = await query;

    // Format the result to include course name
    const formattedResult = result.map((criteria) => ({
      ...criteria,
      courseName: criteria.course?.name || "Unknown Course",
      courseCode: criteria.course?.code || "Unknown Code",
    }));

    return NextResponse.json({
      criteria: formattedResult,
      count: formattedResult.length,
    });
  } catch (error) {
    console.error("[CRITERIA_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create new criteria weights
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, c1Weight, c2Weight, c3Weight, c4Weight, c5Weight } = body;

    // Validate required fields
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    // Check if the course exists
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
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

    // Create new criteria weights with default values if not provided
    const newCriteria = await db
      .insert(criteriaWeights)
      .values({
        courseId,
        c1Weight: c1Weight !== undefined ? c1Weight : 3, // Default value
        c2Weight: c2Weight !== undefined ? c2Weight : 2, // Default value
        c3Weight: c3Weight !== undefined ? c3Weight : 2, // Default value
        c4Weight: c4Weight !== undefined ? c4Weight : 2, // Default value
        c5Weight: c5Weight !== undefined ? c5Weight : 3, // Default value
      })
      .returning();

    return NextResponse.json(newCriteria[0], { status: 201 });
  } catch (error) {
    console.error("[CRITERIA_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
