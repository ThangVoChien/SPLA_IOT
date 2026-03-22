import { NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/AdminService';
import { AuthService } from '@/lib/services/AuthService';

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const { name } = await request.json();
    const org = await AdminService.updateOrg(id, name);
    return NextResponse.json(org);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const session = await AuthService.getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await AdminService.deleteOrg(id, session.orgId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
