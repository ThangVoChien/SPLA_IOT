import { NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/AdminService';

export async function POST(request) {
  try {
    const data = await request.json();
    const sensor = await AdminService.createSensor(data);
    return NextResponse.json(sensor);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
