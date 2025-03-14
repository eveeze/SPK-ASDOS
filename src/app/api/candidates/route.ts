import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { candidates, assessments } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/candidates - Get all candidates
export async function GET() {
  try {
    const allCandidates = await db.query.candidates.findMany({
      with: {
        assessments: true,
      },
    });

    return NextResponse.json(allCandidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

// POST /api/candidates - Create a new candidate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { npm, name, semester } = body;

    // Validate input
    if (!npm || !name || !semester) {
      return NextResponse.json(
        { error: "NPM, name, and semester are required" },
        { status: 400 }
      );
    }

    // Check if candidate with NPM already exists
    const existingCandidate = await db.query.candidates.findFirst({
      where: eq(candidates.npm, npm),
    });

    if (existingCandidate) {
      return NextResponse.json(
        { error: "Candidate with this NPM already exists" },
        { status: 409 }
      );
    }

    const newCandidate = await db
      .insert(candidates)
      .values({
        npm,
        name,
        semester,
      })
      .returning();

    return NextResponse.json(newCandidate[0], { status: 201 });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json(
      { error: "Failed to create candidate" },
      { status: 500 }
    );
  }
}
