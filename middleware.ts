// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/dashboard/"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // If it's not a protected route, continue
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value;

  // If there is no token and the path is protected, redirect to the login page
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", encodeURIComponent(path));
    return NextResponse.redirect(url);
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-fallback-secret-key"
    );
    await jose.jwtVerify(token, secret);

    // If the token is valid, continue
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);

    // If the token is invalid, clear the cookie and redirect to login
    const response = NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(path)}`, request.url)
    );

    // Clear the invalid token
    response.cookies.delete("token");
    return response;
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/dashboard/:path*"],
};
