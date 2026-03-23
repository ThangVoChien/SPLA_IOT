/**
 * Domain Orchestrator Standard Interface:
 * - play(): Server-side DB synchronization (Safe for Node.js)
 * - plug(): Client-side Registry injection (Safe for Browser)
 */

import { Registry } from "../../core/registry.js";
import { prisma } from "../../db/prisma.js";
import { HomeLogic } from "./HomeLogic.js";
import { HomeSidebar } from "./HomeSidebar.js";
import { HomeMapping } from "./HomeMapping.js";
import { HomeSchema } from "./HomeSchema.js";

export const HomeDomain = {
  getSensors() {
    return [
      {
        sensorType: "Room Temperature",
        unit: "C",
        dataType: "INTEGER",
        alertTemplate: "Room temperature alert at ${device}: ${value}C",
      },
      {
        sensorType: "Humidity",
        unit: "%",
        dataType: "FLOAT",
        alertTemplate: "Humidity alert at ${device}: ${value}%",
      },
      {
        sensorType: "Air Quality",
        unit: "AQI",
        dataType: "INTEGER",
        alertTemplate: "Air quality alert at ${device}: AQI ${value}",
      },
    ];
  },

  /**
   * SERVER-SIDE: Database synchronization (Safe for Node.js/Prisma)
   */
  async play() {
    const sensors = this.getSensors();
    try {
      for (const s of sensors) {
        await prisma.sensor.upsert({
          where: { id: s.sensorType },
          update: { ...s },
          create: { ...s, id: s.sensorType },
        });
      }
      console.log("[SPLA-HOME] Database synchronized successfully.");
    } catch (dbError) {
      console.error("[SPLA-HOME] DB sync failed:", dbError.message);
    }
  },

  /**
   * CLIENT-SIDE: Core Registry injection (Safe for Browser/JSX)
   */
  async plug() {
    const { HomeWidget } = await import("./HomeWidget.jsx");

    Registry.plug(HomeLogic, HomeWidget, HomeSidebar, HomeMapping, HomeSchema);
    console.log("[SPLA-HOME] Components plugged into Core Registry.");
  },
};

export default HomeDomain;
