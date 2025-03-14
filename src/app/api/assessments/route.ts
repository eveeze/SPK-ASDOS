import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { assessments, candidates, courses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { convertToScale } from "@/lib/utils/saw";

// GET all assessments, with optional courseId filter
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const courseId = searchParams.get("courseId");

    // Validate query parameters
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId query parameter is required" },
        { status: 400 }
      );
    }

    // Get all assessments for the specified course with candidate names
    const result = await db.query.assessments.findMany({
      where: eq(assessments.courseId, parseInt(courseId)),
      with: {
        candidate: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Map to include candidate name
    const assessmentsWithNames = result.map((assessment) => ({
      ...assessment,
      candidateName: assessment.candidate?.name || "Unknown Candidate",
    }));

    return NextResponse.json({
      assessments: assessmentsWithNames,
      count: assessmentsWithNames.length,
    });
  } catch (error) {
    console.error("[ASSESSMENTS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create a new assessment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      candidateId,
      courseId,
      c1Value,
      c2Value,
      c3Value,
      c4Value,
      c5Value,
    } = body;

    // Validate required fields
    if (
      !candidateId ||
      !courseId ||
      c1Value === undefined ||
      c2Value === undefined ||
      c3Value === undefined ||
      c4Value === undefined ||
      c5Value === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert raw values to 1-5 scale scores
    const c1Score = convertToScale(Number(c1Value), "ipk");
    const c2Score = convertToScale(Number(c2Value), "score");
    const c3Score = convertToScale(Number(c3Value), "score");
    const c4Score = convertToScale(Number(c4Value), "score");
    const c5Score = convertToScale(Number(c5Value), "score");

    // Calculate total score (simple average for now, will be replaced by SAW calculation)
    const totalScore = (c1Score + c2Score + c3Score + c4Score + c5Score) / 5;

    // Check if candidate exists
    const candidate = await db.query.candidates.findFirst({
      where: eq(candidates.id, candidateId),
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Check if course exists
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if assessment already exists for this candidate and course
    const existingAssessment = await db.query.assessments.findFirst({
      where: and(
        eq(assessments.candidateId, candidateId),
        eq(assessments.courseId, courseId)
      ),
    });

    if (existingAssessment) {
      return NextResponse.json(
        { error: "Assessment already exists for this candidate and course" },
        { status: 409 }
      );
    }

    // Create new assessment
    const newAssessment = await db
      .insert(assessments)
      .values({
        candidateId,
        courseId,
        c1Value,
        c2Value,
        c3Value,
        c4Value,
        c5Value,
        c1Score,
        c2Score,
        c3Score,
        c4Score,
        c5Score,
        totalScore,
      })
      .returning();

    return NextResponse.json(newAssessment[0], { status: 201 });
  } catch (error) {
    console.error("[ASSESSMENTS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
