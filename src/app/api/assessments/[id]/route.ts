// app/api/assessments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { assessments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { convertToScale } from "@/lib/utils/saw";

// GET a specific assessment by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid assessment ID" },
        { status: 400 }
      );
    }

    const assessment = await db.query.assessments.findFirst({
      where: eq(assessments.id, id),
      with: {
        candidate: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...assessment,
      candidateName: assessment.candidate?.name || "Unknown Candidate",
    });
  } catch (error) {
    console.error("[ASSESSMENT_GET_BY_ID]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT to update an assessment by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid assessment ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { c1Value, c2Value, c3Value, c4Value, c5Value } = body;

    // Validate required fields
    if (
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

    // Check if assessment exists
    const assessment = await db.query.assessments.findFirst({
      where: eq(assessments.id, id),
    });

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
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

    // Update assessment
    const updatedAssessment = await db
      .update(assessments)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(assessments.id, id))
      .returning();

    return NextResponse.json(updatedAssessment[0]);
  } catch (error) {
    console.error("[ASSESSMENT_PUT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE an assessment by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid assessment ID" },
        { status: 400 }
      );
    }

    // Check if assessment exists
    const assessment = await db.query.assessments.findFirst({
      where: eq(assessments.id, id),
    });

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    // Delete assessment
    await db.delete(assessments).where(eq(assessments.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ASSESSMENT_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
