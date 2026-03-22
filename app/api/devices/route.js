import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/AuthService';
import { DeviceService } from '@/lib/services/DeviceService';

export async function GET() {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const devices = await DeviceService.getDevicesByOrg(session.orgId);
    return NextResponse.json(devices);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const device = await DeviceService.createDevice(session.orgId, session.userId, data);
    return NextResponse.json(device);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
