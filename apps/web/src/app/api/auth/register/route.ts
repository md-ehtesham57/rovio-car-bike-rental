import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { register } from "@/lib/auth";
import { csrfGuard } from "@/lib/csrf";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
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

  const { name, email, password } = parsed.data;
  const result = await register(name, email, password);

  return NextResponse.json(result, { status: result.success ? 201 : 400 });
}
