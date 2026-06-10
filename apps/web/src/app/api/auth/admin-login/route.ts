import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminLogin } from "@/lib/auth";
import { csrfGuard } from "@/lib/csrf";

const schema = z.object({
  email:    z.string().email().max(255),
  password: z.string().min(1).max(128),
});

export async function POST(request: NextRequest) {
  const csrf = csrfGuard(request);
  if (csrf) return csrf;

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: parsed.error.issues[0]?.message || "Validation failed" }, { status: 400 });
  }

  const result = await adminLogin(parsed.data.email, parsed.data.password);
  const status = result.success ? 200 : (result.message?.includes("locked") ? 423 : 401);
  const response = NextResponse.json(result, { status });

  if (result.success && result.data?.token) {
    const cookieOpts = {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge:   60 * 60 * 24,
    };
    response.cookies.set("token", result.data.token, { ...cookieOpts, path: "/" });
  }

  return response;
}
