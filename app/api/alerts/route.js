import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';

export async function GET() {
  try {
    const session = await AuthService.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const alerts = await prisma.alert.findMany({
      where: {
        threshold: {
          device: {
            orgId: session.orgId
          }
        },
        timestamp: {
          gte: twentyFourHoursAgo
        }
      },
      include: {
        threshold: {
          include: {
            device: {
              select: { macAddress: true, name: true }
            }
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 100 // Safety cap
    });

    // Flatten for the frontend
    const flattened = alerts.map(a => ({
      id: a.id,
      severity: a.severity,
      message: a.message,
      macAddress: a.threshold.device.macAddress,
      deviceName: a.threshold.device.name,
      timestamp: a.timestamp
    }));

    return NextResponse.json(flattened);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
