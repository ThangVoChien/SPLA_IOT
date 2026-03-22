import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/AuthService';
import { prisma } from '@/lib/db/prisma.js';

/**
 * GET /api/domain/factory/devices
 * Retrieve devices available for assignment to factory groups
 * Returns unassigned devices OR devices already assigned to the specified group
 * 
 * Query params:
 * - groupId (optional): If provided, also includes devices already in this group
 * 
 * Used by:
 * - FactoryMapping.getAvailableDevices()
 */
export async function GET(request) {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    let query = '';
    if (groupId) {
      // Include unassigned devices OR devices already in this group
      query = `
        SELECT d.*, s.sensorType, s.unit, s.dataType, s.alertTemplate
        FROM devices d
        LEFT JOIN sensors s ON d.sensorId = s.id
        WHERE d.orgId = ? AND (d.productionAreaId IS NULL OR d.productionAreaId = ?)
      `;
    } else {
      // Include only unassigned devices
      query = `
        SELECT d.*, s.sensorType, s.unit, s.dataType, s.alertTemplate
        FROM devices d
        LEFT JOIN sensors s ON d.sensorId = s.id
        WHERE d.orgId = ? AND d.productionAreaId IS NULL
      `;
    }

    const devices = groupId
      ? await prisma.$queryRawUnsafe(query, session.orgId, groupId)
      : await prisma.$queryRawUnsafe(query, session.orgId);

    return NextResponse.json(devices);
  } catch (error) {
    console.error('Error fetching available devices:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
