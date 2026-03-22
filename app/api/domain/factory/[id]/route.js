import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma.js';

/**
 * PUT /api/domain/factory/[id]
 * Update production area
 * Params: id
 * Body: { name, description }
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Area ID is required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    await prisma.$executeRaw`
      UPDATE production_areas 
      SET name = ${name}, description = ${description}, updatedAt = ${now}
      WHERE id = ${id}
    `;

    // Fetch updated area
    const area = await prisma.$queryRaw`
      SELECT * FROM production_areas WHERE id = ${id}
    `;

    if (!area || area.length === 0) {
      return NextResponse.json(
        { error: 'Production area not found' },
        { status: 404 }
      );
    }

    // Fetch devices
    const devices = await prisma.$queryRaw`
      SELECT * FROM devices WHERE productionAreaId = ${id}
    `;

    return NextResponse.json({ ...area[0], devices });
  } catch (error) {
    console.error('Error updating production area:', error);
    return NextResponse.json(
      { error: 'Failed to update production area' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/domain/factory/[id]
 * Delete production area
 * Params: id
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Area ID is required' },
        { status: 400 }
      );
    }

    // First, unassign all devices from this area
    await prisma.$executeRaw`
      UPDATE devices SET productionAreaId = NULL WHERE productionAreaId = ${id}
    `;

    // Then delete the area
    await prisma.$executeRaw`
      DELETE FROM production_areas WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting production area:', error);
    return NextResponse.json(
      { error: 'Failed to delete production area' },
      { status: 500 }
    );
  }
}
