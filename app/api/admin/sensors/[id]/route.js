import { NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/AdminService';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const sensor = await AdminService.updateSensor(id, data);
    return NextResponse.json(sensor);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await AdminService.deleteSensor(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
