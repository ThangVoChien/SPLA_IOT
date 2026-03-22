import { NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/AdminService';

export async function POST(request) {
  try {
    const { name } = await request.json();
    const org = await AdminService.createOrg(name);
    return NextResponse.json(org);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
