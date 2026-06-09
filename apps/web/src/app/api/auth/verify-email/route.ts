import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyEmail } from "@/lib/auth";
import { csrfGuard } from "@/lib/csrf";

const schema = z.object({
  code: z.string().length(6, "Verification code must be exactly 6 digits"),
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

  const { code } = parsed.data;
  const result = await verifyEmail(code);

  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
