import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { login } from "@/lib/auth";
import { csrfGuard } from "@/lib/csrf";

const schema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(128),
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

  const { email, password } = parsed.data;
  const result = await login(email, password);

  const response = NextResponse.json(result, { status: result.success ? 200 : 401 });

  if (result.success && result.data?.token) {
    response.cookies.set("token", result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
  }

  return response;
}
