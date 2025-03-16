import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { courses, assessments } from "@/db/schema";
import { eq } from "drizzle-orm";

// Helper function to get course by ID
async function getCourseById(id: number) {
  return await db.query.courses.findFirst({
    where: eq(courses.id, id),
    with: {
      criteriaWeights: true,
      assessmentPeriods: true,
    },
  });
}

// GET /api/course/[id] - Get a specific course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(await params.id); // Use await here
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const course = await getCourseById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

// PUT /api/course/[id] - Update a course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(await params.id); // Use await here
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const body = await request.json();
    const { code, name, description } = body;

    // Validate input
    if (!code || !name) {
      return NextResponse.json(
        { error: "Course code and name are required" },
        { status: 400 }
      );
    }

    // Check if course exists
    const existingCourse = await getCourseById(id);
    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if code is being changed and if it already exists on another course
    if (code !== existingCourse.code) {
      const duplicateCode = await db.query.courses.findFirst({
        where: eq(courses.code, code),
      });

      if (duplicateCode) {
        return NextResponse.json(
          { error: "Another course with this code already exists" },
          { status: 409 }
        );
      }
    }

    const updatedCourse = await db
      .update(courses)
      .set({
        code,
        name,
        description,
      })
      .where(eq(courses.id, id))
      .returning();

    return NextResponse.json(updatedCourse[0]);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE /api/course/[id] - Delete a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(await params.id); // Use await here
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    // Check if course exists
    const course = await getCourseById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    await db.delete(assessments).where(eq(assessments.candidateId, id));

    // Delete course (related criteria weights and assessment periods will cascade delete based on schema)
    await db.delete(courses).where(eq(courses.id, id));

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
