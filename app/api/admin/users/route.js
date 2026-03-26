import { NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/AdminService';

/**
 * Endpoint for global identity provisioning.
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const user = await AdminService.addUser(data);
    return NextResponse.json(user);
  } catch (error) {
    const status = /required|exists|invalid/i.test(error.message) ? 400 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
