import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const INTERNAL_API_KEY = process.env.API_KEY || '';

/**
 * POST /api/bookings/[id]/cancel
 * Proxies to Express: POST /api/v1/bookings/:id/cancel (Cancel a booking)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15 before extracting properties
    const { id } = await params;
    const token = req.cookies.get('token')?.value;

    const response = await fetch(`${BACKEND_URL}/api/v1/bookings/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': INTERNAL_API_KEY,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy Error [POST /api/bookings/[id]/cancel]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error in API Proxy' },
      { status: 500 }
    );
  }
}