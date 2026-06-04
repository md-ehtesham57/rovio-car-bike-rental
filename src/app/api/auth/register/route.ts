import { NextRequest, NextResponse } from "next/server";
import { register } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  const result = await register(name, email, password);

  return NextResponse.json(result, { status: result.success ? 201 : 400 });
}
