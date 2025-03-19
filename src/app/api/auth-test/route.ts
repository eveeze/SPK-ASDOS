// src/app/api/auth-test/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          status: "unauthenticated",
          message: "No token found",
        },
        { status: 401 }
      );
    }

    // Verify token
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const decoded = await jose.jwtVerify(token, secret);

      return NextResponse.json({
        status: "authenticated",
        user: decoded.payload,
        message: "Token is valid",
      });
    } catch (error) {
      return NextResponse.json(
        {
          status: "invalid",
          message: "Token is invalid",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Error checking authentication",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
