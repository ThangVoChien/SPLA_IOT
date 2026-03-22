import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';

export async function GET() {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT id, name, description, createdAt, updatedAt FROM fields ORDER BY createdAt DESC`
    );

    const groups = Array.isArray(rows)
      ? rows.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          status: 'ACTIVE'
        }))
      : [];

    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to load fields' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const name = (body.name || body.fieldName || '').trim();
    const description = (body.description || body.location || '').trim();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    await prisma.$executeRawUnsafe(
      `INSERT INTO fields (id, name, description) VALUES (?, ?, ?)`,
      id,
      name,
      description
    );

    return NextResponse.json({ id, name, description, status: 'ACTIVE' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create field' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const groupId = body.groupId || body.fieldId;
    const deviceIds = Array.isArray(body.deviceIds) ? body.deviceIds : [];
    const action = body.action;

    if (!groupId || !action) {
      return NextResponse.json({ error: 'groupId and action are required' }, { status: 400 });
    }

    if (action === 'assign') {
      await prisma.$executeRawUnsafe(
        `UPDATE devices SET fieldId = NULL WHERE fieldId = ?`,
        groupId
      );

      if (deviceIds.length > 0) {
        for (const deviceId of deviceIds) {
          await prisma.$executeRawUnsafe(
            `UPDATE devices SET fieldId = ? WHERE id = ?`,
            groupId,
            deviceId
          );
        }
      }

      return NextResponse.json({ success: true, assigned: deviceIds.length });
    }

    if (action === 'unassign') {
      if (deviceIds.length > 0) {
        for (const deviceId of deviceIds) {
          await prisma.$executeRawUnsafe(
            `UPDATE devices SET fieldId = NULL WHERE id = ? AND fieldId = ?`,
            deviceId,
            groupId
          );
        }
        return NextResponse.json({ success: true, unassigned: deviceIds.length });
      }

      await prisma.$executeRawUnsafe(
        `UPDATE devices SET fieldId = NULL WHERE fieldId = ?`,
        groupId
      );
      return NextResponse.json({ success: true, unassigned: 0 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update assignments' }, { status: 500 });
  }
}
