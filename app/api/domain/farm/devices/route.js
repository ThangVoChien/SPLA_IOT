import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';

export async function GET(request) {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const fieldId = searchParams.get('fieldId');

    let rows = [];
    if (fieldId) {
      rows = await prisma.$queryRawUnsafe(
        `SELECT id, name, status, sensorId, fieldId, orgId
         FROM devices
         WHERE orgId = ? AND (fieldId IS NULL OR fieldId = ?)
         ORDER BY name ASC`,
        session.orgId,
        fieldId
      );
    } else {
      rows = await prisma.$queryRawUnsafe(
        `SELECT id, name, status, sensorId, fieldId, orgId
         FROM devices
         WHERE orgId = ? AND fieldId IS NULL
         ORDER BY name ASC`,
        session.orgId
      );
    }

    const devices = Array.isArray(rows)
      ? rows.map((d) => ({
          ...d,
          productionAreaId: d.fieldId
        }))
      : [];

    return NextResponse.json(devices);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to load available devices' }, { status: 500 });
  }
}
