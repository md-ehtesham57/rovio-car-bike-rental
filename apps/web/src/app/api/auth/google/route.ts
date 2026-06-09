import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { csrfGuard } from "@/lib/csrf";

const API_URL = process.env.API_URL || "http://localhost:5000";

const schema = z.object({
  credential: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const csrf = csrfGuard(request);
  if (csrf) return csrf;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Validation failed";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }

  let res;
  try {
    res = await fetch(`${API_URL}/api/v1/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: parsed.data.credential }),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Authentication service unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const data = await res.json();

  const response = NextResponse.json(data, { status: res.ok ? 200 : 401 });

  if (data.success && data.data?.token) {
    response.cookies.set("token", data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
  }

  return response;
}
