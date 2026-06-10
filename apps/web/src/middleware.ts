import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

type TokenPayload = { id: string; role?: string };

async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

const protectedRoutes = ["/profile", "/bookings"];
const authRoutes      = ["/login", "/register"];
const adminRoutes     = ["/admin/dashboard", "/admin/profile", "/admin/users", "/admin/vehicles", "/admin/bookings"];
const sellerRoutes    = ["/seller/dashboard", "/seller/vehicles"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const payload = token ? await verifyToken(token) : null;

  // ─── Admin routes — must be authenticated + admin role ──────────────────────
  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    if (!payload) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ─── Admin login — redirect to dashboard if already admin ───────────────────
  if (pathname === "/admin/login") {
    if (payload?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ─── Seller routes — must be authenticated + seller/admin role ──────────────
  if (sellerRoutes.some((r) => pathname.startsWith(r))) {
    if (!payload) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (payload.role !== "seller" && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ─── Standard protected routes ───────────────────────────────────────────────
  if (protectedRoutes.some((r) => pathname.startsWith(r))) {
    if (!payload) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ─── Auth routes — redirect if already logged in ─────────────────────────────
  if (authRoutes.some((r) => pathname.startsWith(r)) && payload) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/bookings/:path*",
    "/login",
    "/register",
    "/admin/:path*",
    "/seller/:path*",
  ],
};
