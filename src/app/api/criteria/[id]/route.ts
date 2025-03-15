// app/api/criteria/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { criteriaWeights } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET a specific criteria weight by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid criteria ID" },
        { status: 400 }
      );
    }

    const criteria = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.id, id),
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
        { error: "Criteria weights not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...criteria,
      courseName: criteria.course?.name || "Unknown Course",
      courseCode: criteria.course?.code || "Unknown Code",
    });
  } catch (error) {
    console.error("[CRITERIA_GET_BY_ID]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT to update criteria weights by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid criteria ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { c1Weight, c2Weight, c3Weight, c4Weight, c5Weight } = body;

    // Check if criteria exists
    const criteria = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.id, id),
    });

    if (!criteria) {
      return NextResponse.json(
        { error: "Criteria weights not found" },
        { status: 404 }
      );
    }

    // Update criteria weights
    const updatedCriteria = await db
      .update(criteriaWeights)
      .set({
        c1Weight: c1Weight !== undefined ? c1Weight : criteria.c1Weight,
        c2Weight: c2Weight !== undefined ? c2Weight : criteria.c2Weight,
        c3Weight: c3Weight !== undefined ? c3Weight : criteria.c3Weight,
        c4Weight: c4Weight !== undefined ? c4Weight : criteria.c4Weight,
        c5Weight: c5Weight !== undefined ? c5Weight : criteria.c5Weight,
      })
      .where(eq(criteriaWeights.id, id))
      .returning();

    return NextResponse.json(updatedCriteria[0]);
  } catch (error) {
    console.error("[CRITERIA_PUT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE criteria weights by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid criteria ID" },
        { status: 400 }
      );
    }

    // Check if criteria exists
    const criteria = await db.query.criteriaWeights.findFirst({
      where: eq(criteriaWeights.id, id),
    });

    if (!criteria) {
      return NextResponse.json(
        { error: "Criteria weights not found" },
        { status: 404 }
      );
    }

    // Delete criteria weights
    await db.delete(criteriaWeights).where(eq(criteriaWeights.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CRITERIA_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
