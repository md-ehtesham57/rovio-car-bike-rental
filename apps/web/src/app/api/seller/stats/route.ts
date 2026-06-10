import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function proxy(request: NextRequest, path: string, init?: RequestInit) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { Cookie: `token=${token}`, "Content-Type": "application/json", ...init?.headers },
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Service unavailable" }, { status: 503 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.toString();
  return proxy(request, `/api/v1/seller/stats${q ? `?${q}` : ""}`);
}
