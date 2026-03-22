import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma.js';

/**
 * GET /api/domain/factory
 * Retrieve all production areas with their devices
 */
export async function GET(request) {
  try {
    const areas = await prisma.$queryRaw`
      SELECT * FROM production_areas ORDER BY createdAt DESC
    `;
    
    // Fetch devices for each area
    const areasWithDevices = await Promise.all(
      areas.map(async (area) => {
        const devices = await prisma.$queryRaw`
          SELECT * FROM devices WHERE productionAreaId = ${area.id}
        `;
        return { ...area, devices };
      })
    );

    return NextResponse.json(areasWithDevices);
  } catch (error) {
    console.error('Error fetching production areas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch production areas' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/domain/factory
 * Create a new production area
 * Body: { name, description }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Area name is required' },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await prisma.$executeRaw`
      INSERT INTO production_areas (id, name, description, createdAt, updatedAt)
      VALUES (${id}, ${name}, ${description || null}, ${now}, ${now})
    `;

    const area = {
      id,
      name,
      description: description || null,
      devices: [],
      createdAt: now
    };

    return NextResponse.json(area, { status: 201 });
  } catch (error) {
    console.error('Error creating production area:', error);
    return NextResponse.json(
      { error: 'Failed to create production area' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/domain/factory
 * Assign or unassign devices to production area
 * Body: { groupId, deviceIds, action }
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { groupId, deviceIds, action } = body;

    if (!groupId || !deviceIds || !action) {
      return NextResponse.json(
        { error: 'groupId, deviceIds, and action are required' },
        { status: 400 }
      );
    }

    // Verify area exists
    const area = await prisma.$queryRaw`
      SELECT * FROM production_areas WHERE id = ${groupId}
    `;

    if (!area || area.length === 0) {
      return NextResponse.json(
        { error: 'Production area not found' },
        { status: 404 }
      );
    }

    if (action === 'assign') {
      // First, unassign all devices from this group
      await prisma.$executeRaw`
        UPDATE devices SET productionAreaId = NULL WHERE productionAreaId = ${groupId}
      `;
      
      // Then assign the selected devices
      for (const deviceId of deviceIds) {
        await prisma.$executeRaw`
          UPDATE devices SET productionAreaId = ${groupId} WHERE id = ${deviceId}
        `;
      }
    } else if (action === 'unassign') {
      for (const deviceId of deviceIds) {
        await prisma.$executeRaw`
          UPDATE devices SET productionAreaId = NULL WHERE id = ${deviceId}
        `;
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Return updated area with devices
    const devices = await prisma.$queryRaw`
      SELECT * FROM devices WHERE productionAreaId = ${groupId}
    `;

    return NextResponse.json({ ...area[0], devices });
  } catch (error) {
    console.error('Error updating devices:', error);
    return NextResponse.json(
      { error: 'Failed to update devices' },
      { status: 500 }
    );
  }
}
