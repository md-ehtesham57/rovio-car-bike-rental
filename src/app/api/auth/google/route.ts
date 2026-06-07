import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { csrfGuard } from "@/lib/csrf";

const AUTH_URL = process.env.LEMU_AUTH_URL || "http://localhost:5000";
const API_KEY = process.env.LEMU_API_KEY || "";

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

  const res = await fetch(`${AUTH_URL}/api/v1/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY ? { "x-api-key": API_KEY } : {}),
    },
    body: JSON.stringify({ credential: parsed.data.credential }),
  });

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
