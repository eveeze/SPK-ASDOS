// app/api/criteria/course/[courseId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { criteriaWeights, courses } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET criteria weights for a specific course by courseId
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = parseInt(params.courseId);

    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    // Check if the course exists
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get criteria weights for the course
    const criteria = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.courseId, courseId),
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

    if (!criteria) {
      return NextResponse.json(
        { error: "No criteria weights found for this course" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...criteria,
      courseName: criteria.course?.name || "Unknown Course",
      courseCode: criteria.course?.code || "Unknown Code",
    });
  } catch (error) {
    console.error("[CRITERIA_GET_BY_COURSE_ID]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT to update criteria weights for a specific course by courseId
export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = parseInt(params.courseId);

    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const body = await req.json();
    const { c1Weight, c2Weight, c3Weight, c4Weight, c5Weight } = body;

    // Check if the course exists
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if criteria weights exist for this course
    const existingCriteria = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.courseId, courseId),
    });

    if (!existingCriteria) {
      // If criteria weights don't exist, create them
      const newCriteria = await db
        .insert(criteriaWeights)
        .values({
          courseId,
          c1Weight: c1Weight !== undefined ? c1Weight : 3,
          c2Weight: c2Weight !== undefined ? c2Weight : 2,
          c3Weight: c3Weight !== undefined ? c3Weight : 2,
          c4Weight: c4Weight !== undefined ? c4Weight : 2,
          c5Weight: c5Weight !== undefined ? c5Weight : 3,
        })
        .returning();

      return NextResponse.json(newCriteria[0], { status: 201 });
    }

    // Update existing criteria weights
    const updatedCriteria = await db
      .update(criteriaWeights)
      .set({
        c1Weight: c1Weight !== undefined ? c1Weight : existingCriteria.c1Weight,
        c2Weight: c2Weight !== undefined ? c2Weight : existingCriteria.c2Weight,
        c3Weight: c3Weight !== undefined ? c3Weight : existingCriteria.c3Weight,
        c4Weight: c4Weight !== undefined ? c4Weight : existingCriteria.c4Weight,
        c5Weight: c5Weight !== undefined ? c5Weight : existingCriteria.c5Weight,
      })
      .where(eq(criteriaWeights.courseId, courseId))
      .returning();

    return NextResponse.json(updatedCriteria[0]);
  } catch (error) {
    console.error("[CRITERIA_PUT_BY_COURSE_ID]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE criteria weights for a specific course by courseId
export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = parseInt(params.courseId);

    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    // Check if criteria weights exist for this course
    const criteria = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.courseId, courseId),
    });

    if (!criteria) {
      return NextResponse.json(
        { error: "No criteria weights found for this course" },
        { status: 404 }
      );
    }

    // Delete criteria weights
    await db
      .delete(criteriaWeights)
      .where(eq(criteriaWeights.courseId, courseId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CRITERIA_DELETE_BY_COURSE_ID]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
