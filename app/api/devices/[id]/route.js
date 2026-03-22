import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/AuthService';
import { DeviceService } from '@/lib/services/DeviceService';

export async function PUT(request, { params }) {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const data = await request.json();
    const device = await DeviceService.updateDevice(id, session.orgId, session.userId, data);
    return NextResponse.json(device);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await DeviceService.deleteDevice(id, session.orgId, session.userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
