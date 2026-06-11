import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const INTERNAL_API_KEY = process.env.API_KEY || '';

/**
 * GET /api/bookings
 * Proxies to Express: GET /api/v1/bookings (Fetch user booking history)
 */
export async function GET(req: NextRequest) {
  try {
    // Extract the token from the incoming httpOnly cookies
    const token = req.cookies.get('token')?.value;

    const response = await fetch(`${BACKEND_URL}/api/v1/bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': INTERNAL_API_KEY,
        // Forward the token in the Authorization header to the Express API
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy Error [GET /api/bookings]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error in API Proxy' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bookings
 * Proxies to Express: POST /api/v1/bookings (Create a booking)
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    const body = await req.json();

    const response = await fetch(`${BACKEND_URL}/api/v1/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': INTERNAL_API_KEY,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy Error [POST /api/bookings]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error in API Proxy' },
      { status: 500 }
    );
  }
}