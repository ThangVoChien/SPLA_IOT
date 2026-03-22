import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';

export async function PUT(request, { params }) {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const name = (body.name || body.fieldName || '').trim();
    const description = (body.description || body.location || '').trim();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await prisma.$executeRawUnsafe(
      `UPDATE fields SET name = ?, description = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      name,
      description,
      id
    );

    return NextResponse.json({ id, name, description, status: 'ACTIVE' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update field' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;

    await prisma.$executeRawUnsafe(`UPDATE devices SET fieldId = NULL WHERE fieldId = ?`, id);
    await prisma.$executeRawUnsafe(`DELETE FROM fields WHERE id = ?`, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to delete field' }, { status: 500 });
  }
}
