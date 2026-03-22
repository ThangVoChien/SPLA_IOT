import { NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/AdminService';
import { AuthService } from '@/lib/services/AuthService';

/**
 * Endpoint for specific identity governance (Update, Delete, Role Change).
 */
export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const user = await AdminService.updateUser(id, data);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const session = await AuthService.getSession();
  try {
    await AdminService.deleteUser(id, session.userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const session = await AuthService.getSession();
  try {
    const { role } = await request.json();
    const user = await AdminService.changeUserRole(id, role, session.userId);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
