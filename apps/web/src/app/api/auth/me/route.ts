import { NextRequest, NextResponse } from "next/server";
import { verifyToken, type DecodedToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
  }

  const user = decoded as DecodedToken;
  return NextResponse.json({
    success: true,
    data: {
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: user.role || "user",
        picture: user.picture,
        emailVerified: user.emailVerified,
      },
    },
  });
}
