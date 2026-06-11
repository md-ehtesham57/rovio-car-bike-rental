import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const INTERNAL_API_KEY = process.env.API_KEY || '';

/**
 * GET /api/bookings/[id]
 * Proxies to Express: GET /api/v1/bookings/:id (Fetch single booking details)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15 before extracting properties
    const { id } = await params;
    const token = req.cookies.get('token')?.value;

    const response = await fetch(`${BACKEND_URL}/api/v1/bookings/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': INTERNAL_API_KEY,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy Error [GET /api/bookings/[id]]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error in API Proxy' },
      { status: 500 }
    );
  }
}