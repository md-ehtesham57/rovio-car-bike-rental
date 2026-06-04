import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

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
