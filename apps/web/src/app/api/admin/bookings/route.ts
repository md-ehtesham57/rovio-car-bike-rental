import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.toString();

  try {
    const res = await fetch(`${API_URL}/api/v1/admin/bookings${q ? `?${q}` : ""}`, {
      headers: { Cookie: `token=${token}` },
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Service unavailable" }, { status: 503 });
  }
}
