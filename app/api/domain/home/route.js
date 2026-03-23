import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma.js";

/**
 * GET /api/domain/home
 * Retrieve all home zones with their devices.
 */
export async function GET() {
  try {
    const zones = await prisma.$queryRaw`
      SELECT * FROM home_zones ORDER BY createdAt DESC
    `;

    const zonesWithDevices = await Promise.all(
      zones.map(async (zone) => {
        const devices = await prisma.$queryRaw`
          SELECT * FROM devices WHERE home_zoneId = ${zone.id}
        `;
        return { ...zone, devices };
      }),
    );

    return NextResponse.json(zonesWithDevices);
  } catch (error) {
    console.error("Error fetching home zones:", error);
    return NextResponse.json(
      { error: "Failed to fetch home zones" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/domain/home
 * Create a new home zone.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Zone name is required" },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await prisma.$executeRaw`
      INSERT INTO home_zones (id, name, description, createdAt, updatedAt)
      VALUES (${id}, ${name}, ${description || null}, ${now}, ${now})
    `;

    const zone = {
      id,
      name,
      description: description || null,
      devices: [],
      createdAt: now,
    };

    return NextResponse.json(zone, { status: 201 });
  } catch (error) {
    console.error("Error creating home zone:", error);
    return NextResponse.json(
      { error: "Failed to create home zone" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/domain/home
 * Assign or unassign devices to a home zone.
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { groupId, deviceIds, action } = body;

    if (!groupId || !deviceIds || !action) {
      return NextResponse.json(
        { error: "groupId, deviceIds, and action are required" },
        { status: 400 },
      );
    }

    const zone = await prisma.$queryRaw`
      SELECT * FROM home_zones WHERE id = ${groupId}
    `;

    if (!zone || zone.length === 0) {
      return NextResponse.json(
        { error: "Home zone not found" },
        { status: 404 },
      );
    }

    if (action === "assign") {
      await prisma.$executeRaw`
        UPDATE devices SET home_zoneId = NULL WHERE home_zoneId = ${groupId}
      `;

      for (const deviceId of deviceIds) {
        await prisma.$executeRaw`
          UPDATE devices SET home_zoneId = ${groupId} WHERE id = ${deviceId}
        `;
      }
    } else if (action === "unassign") {
      for (const deviceId of deviceIds) {
        await prisma.$executeRaw`
          UPDATE devices SET home_zoneId = NULL WHERE id = ${deviceId}
        `;
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const devices = await prisma.$queryRaw`
      SELECT * FROM devices WHERE home_zoneId = ${groupId}
    `;

    return NextResponse.json({ ...zone[0], devices });
  } catch (error) {
    console.error("Error updating home devices:", error);
    return NextResponse.json(
      { error: "Failed to update devices" },
      { status: 500 },
    );
  }
}
