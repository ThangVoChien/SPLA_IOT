import { NextResponse } from "next/server";
import { AuthService } from "@/lib/services/AuthService";
import { prisma } from "@/lib/db/prisma.js";

/**
 * GET /api/domain/home/devices
 * Retrieve devices available for assignment to home zones.
 */
export async function GET(request) {
  const session = await AuthService.getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    let query = "";
    if (groupId) {
      query = `
        SELECT d.*, d.home_zoneId as productionAreaId, s.sensorType, s.unit, s.dataType, s.alertTemplate
        FROM devices d
        LEFT JOIN sensors s ON d.sensorId = s.id
        WHERE d.orgId = ? AND (d.home_zoneId IS NULL OR d.home_zoneId = ?)
      `;
    } else {
      query = `
        SELECT d.*, d.home_zoneId as productionAreaId, s.sensorType, s.unit, s.dataType, s.alertTemplate
        FROM devices d
        LEFT JOIN sensors s ON d.sensorId = s.id
        WHERE d.orgId = ? AND d.home_zoneId IS NULL
      `;
    }

    const devices = groupId
      ? await prisma.$queryRawUnsafe(query, session.orgId, groupId)
      : await prisma.$queryRawUnsafe(query, session.orgId);

    return NextResponse.json(devices);
  } catch (error) {
    console.error("Error fetching available home devices:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
