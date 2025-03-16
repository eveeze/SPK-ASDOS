import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { candidates, assessments } from "@/db/schema";
import { eq } from "drizzle-orm";

// Helper function to handle candidate by ID operations
async function getCandidateById(id: number) {
  return await db.query.candidates.findFirst({
    where: eq(candidates.id, id),
    with: {
      assessments: true,
    },
  });
}

// GET /api/candidates/[id] - Get a specific candidate
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid candidate ID" },
        { status: 400 }
      );
    }

    const candidate = await getCandidateById(id);
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(candidate);
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidate" },
      { status: 500 }
    );
  }
}

// PUT /api/candidates/[id] - Update a candidate
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid candidate ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { npm, name, semester } = body;

    // Validate input
    if (!npm || !name || !semester) {
      return NextResponse.json(
        { error: "NPM, name, and semester are required" },
        { status: 400 }
      );
    }

    // Check if candidate exists
    const existingCandidate = await getCandidateById(id);
    if (!existingCandidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Check if NPM is being changed and if it already exists on another candidate
    if (npm !== existingCandidate.npm) {
      const duplicateNpm = await db.query.candidates.findFirst({
        where: eq(candidates.npm, npm),
      });

      if (duplicateNpm) {
        return NextResponse.json(
          { error: "Another candidate with this NPM already exists" },
          { status: 409 }
        );
      }
    }

    const updatedCandidate = await db
      .update(candidates)
      .set({
        npm,
        name,
        semester,
        updatedAt: new Date(),
      })
      .where(eq(candidates.id, id))
      .returning();

    return NextResponse.json(updatedCandidate[0]);
  } catch (error) {
    console.error("Error updating candidate:", error);
    return NextResponse.json(
      { error: "Failed to update candidate" },
      { status: 500 }
    );
  }
}

// DELETE /api/candidates/[id] - Delete a candidate
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(await params.id); // Use await here
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid candidate ID" },
        { status: 400 }
      );
    }

    // Check if candidate exists
    const candidate = await getCandidateById(id);
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }
    await db.delete(assessments).where(eq(assessments.candidateId, id));

    // Delete candidate (related assessments will cascade delete based on schema)
    await db.delete(candidates).where(eq(candidates.id, id));

    return NextResponse.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return NextResponse.json(
      { error: "Failed to delete candidate" },
      { status: 500 }
    );
  }
}
