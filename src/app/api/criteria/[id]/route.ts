import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { criteriaWeights } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/criteria/[id] - Get criteria weights by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid criteria weights ID" },
        { status: 400 }
      );
    }

    const criteriaWeight = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.id, id),
      with: {
        course: true,
      },
    });

    if (!criteriaWeight) {
      return NextResponse.json(
        { error: "Criteria weights not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(criteriaWeight);
  } catch (error) {
    console.error("Error fetching criteria weights:", error);
    return NextResponse.json(
      { error: "Failed to fetch criteria weights" },
      { status: 500 }
    );
  }
}

// PUT /api/criteria/[id] - Update criteria weights
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid criteria weights ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { c1Weight, c2Weight, c3Weight, c4Weight, c5Weight } = body;

    // Check if criteria weights exist
    const existingCriteriaWeights = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.id, id),
    });

    if (!existingCriteriaWeights) {
      return NextResponse.json(
        { error: "Criteria weights not found" },
        { status: 404 }
      );
    }

    const updatedCriteriaWeights = await db
      .update(criteriaWeights)
      .set({
        c1Weight: c1Weight ?? existingCriteriaWeights.c1Weight,
        c2Weight: c2Weight ?? existingCriteriaWeights.c2Weight,
        c3Weight: c3Weight ?? existingCriteriaWeights.c3Weight,
        c4Weight: c4Weight ?? existingCriteriaWeights.c4Weight,
        c5Weight: c5Weight ?? existingCriteriaWeights.c5Weight,
      })
      .where(eq(criteriaWeights.id, id))
      .returning();

    return NextResponse.json(updatedCriteriaWeights[0]);
  } catch (error) {
    console.error("Error updating criteria weights:", error);
    return NextResponse.json(
      { error: "Failed to update criteria weights" },
      { status: 500 }
    );
  }
}

// DELETE /api/criteria/[id] - Delete criteria weights
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid criteria weights ID" },
        { status: 400 }
      );
    }

    // Check if criteria weights exist
    const criteriaWeight = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.id, id),
    });

    if (!criteriaWeight) {
      return NextResponse.json(
        { error: "Criteria weights not found" },
        { status: 404 }
      );
    }

    await db.delete(criteriaWeights).where(eq(criteriaWeights.id, id));

    return NextResponse.json({
      message: "Criteria weights deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting criteria weights:", error);
    return NextResponse.json(
      { error: "Failed to delete criteria weights" },
      { status: 500 }
    );
  }
}
