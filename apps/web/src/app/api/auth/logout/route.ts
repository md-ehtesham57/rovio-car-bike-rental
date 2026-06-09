import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (token) {
    try {
      await logout(token);
    } catch {
      // Token invalidation failure is non-fatal; cookie is cleared below
    }
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully." });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}
