import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma.js";

/**
 * PUT /api/domain/home/[id]
 * Update a home zone.
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Zone ID is required" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();

    await prisma.$executeRaw`
      UPDATE home_zones
      SET name = ${name}, description = ${description}, updatedAt = ${now}
      WHERE id = ${id}
    `;

    const zone = await prisma.$queryRaw`
      SELECT * FROM home_zones WHERE id = ${id}
    `;

    if (!zone || zone.length === 0) {
      return NextResponse.json(
        { error: "Home zone not found" },
        { status: 404 },
      );
    }

    const devices = await prisma.$queryRaw`
      SELECT * FROM devices WHERE home_zoneId = ${id}
    `;

    return NextResponse.json({ ...zone[0], devices });
  } catch (error) {
    console.error("Error updating home zone:", error);
    return NextResponse.json(
      { error: "Failed to update home zone" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/domain/home/[id]
 * Delete a home zone.
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Zone ID is required" },
        { status: 400 },
      );
    }

    await prisma.$executeRaw`
      UPDATE devices SET home_zoneId = NULL WHERE home_zoneId = ${id}
    `;

    await prisma.$executeRaw`
      DELETE FROM home_zones WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting home zone:", error);
    return NextResponse.json(
      { error: "Failed to delete home zone" },
      { status: 500 },
    );
  }
}
