import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';

/**
 * Public (Authed) Sensor List for Device Registration.
 * Allows any authenticated user to view available sensor types
 * for their organization's device fleet.
 */
export async function GET() {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const sensors = await prisma.sensor.findMany({
      select: { 
        id: true, 
        sensorType: true, 
        unit: true 
      },
      orderBy: { sensorType: 'asc' }
    });
    return NextResponse.json(sensors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sensors' }, { status: 500 });
  }
}
