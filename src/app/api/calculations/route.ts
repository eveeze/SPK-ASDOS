// app/api/calculations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { assessments, criteriaWeights } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  calculateNormalizedMatrix,
  calculatePreferenceValues,
} from "@/lib/utils/saw";
import { type SAWResult } from "@/lib/types";

// GET: retrieve SAW calculations for a specific course
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

    const courseIdNum = parseInt(courseId);

    // Get all assessments for the specified course
    const assessmentResults = await db.query.assessments.findMany({
      where: eq(assessments.courseId, courseIdNum),
      with: {
        candidate: true,
      },
    });

    // Add candidate name to assessments
    const assessmentsWithNames = assessmentResults.map((assessment) => ({
      ...assessment,
      candidateName: assessment.candidate.name,
    }));

    // Get criteria weights for the course
    const weightsResult = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.courseId, courseIdNum),
    });

    if (!weightsResult) {
      return NextResponse.json(
        { error: "Criteria weights not found for this course" },
        { status: 404 }
      );
    }

    // Prepare matrix for SAW calculation
    const matrix = assessmentsWithNames.map((assessment) => ({
      id: assessment.id,
      candidateId: assessment.candidateId,
      candidateName: assessment.candidateName,
      c1Score: Number(assessment.c1Score),
      c2Score: Number(assessment.c2Score),
      c3Score: Number(assessment.c3Score),
      c4Score: Number(assessment.c4Score),
      c5Score: Number(assessment.c5Score),
    }));

    // Calculate normalized matrix
    const { normalized } = calculateNormalizedMatrix(assessmentsWithNames);

    // Calculate preference values
    const preferenceValues = calculatePreferenceValues(
      normalized,
      weightsResult
    );

    // Sort preference values by descending order
    const sortedPreferenceValues = [...preferenceValues].sort(
      (a, b) => b.preferenceValue - a.preferenceValue
    );

    // Prepare final result
    const result: SAWResult = {
      matrix,
      normalized,
      preferenceValues: sortedPreferenceValues,
      weights: weightsResult,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[CALCULATIONS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: recalculate all scores based on criteria weights and update database
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId } = body;

    // Validate required fields
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    // Get all assessments for the course
    const assessmentResults = await db.query.assessments.findMany({
      where: eq(assessments.courseId, courseId),
      with: {
        candidate: true,
      },
    });

    if (assessmentResults.length === 0) {
      return NextResponse.json(
        { error: "No assessments found for this course" },
        { status: 404 }
      );
    }

    // Get criteria weights
    const weightsResult = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.courseId, courseId),
    });

    if (!weightsResult) {
      return NextResponse.json(
        { error: "Criteria weights not found for this course" },
        { status: 404 }
      );
    }

    // Add candidate names to assessments
    const assessmentsWithNames = assessmentResults.map((assessment) => ({
      ...assessment,
      candidateName: assessment.candidate.name,
    }));

    // Calculate normalized matrix
    const { normalized } = calculateNormalizedMatrix(assessmentsWithNames);

    // Calculate preference values with weights
    const preferenceValues = calculatePreferenceValues(
      normalized,
      weightsResult
    );

    // Update total scores in the database
    for (const pv of preferenceValues) {
      await db
        .update(assessments)
        .set({
          totalScore: pv.preferenceValue,
          updatedAt: new Date(),
        })
        .where(eq(assessments.id, pv.id));
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${preferenceValues.length} assessment scores`,
      preferenceValues,
    });
  } catch (error) {
    console.error("[CALCULATIONS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
