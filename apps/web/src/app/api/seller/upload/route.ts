import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${API_URL}/api/v1/seller/upload`, {
    method: "POST",
    headers: token ? { Cookie: `token=${token}` } : {},
    body: formData,
  });

  return NextResponse.json(await res.json(), { status: res.status });
}
