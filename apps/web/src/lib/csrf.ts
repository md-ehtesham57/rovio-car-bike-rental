import { NextRequest, NextResponse } from "next/server";

/**
 * Validates Origin / Referer header to mitigate CSRF attacks.
 * Returns a 403 response on mismatch, or null if valid.
 */
export function csrfGuard(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const expected = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Allow same-origin via Origin header
  if (origin && origin !== expected) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  // Fall back to Referer if Origin is absent
  if (!origin && referer && !referer.startsWith(expected)) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  return null;
}
