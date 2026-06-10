import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/api/v1/admin/vehicles/${id}`, {
      method: "DELETE",
      headers: { Cookie: `token=${token}` },
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Service unavailable" }, { status: 503 });
  }
}
