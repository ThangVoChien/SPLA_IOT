/**
 * Domain Orchestrator Standard Interface:
 * - play(): Server-side DB synchronization (Safe for Node.js)
 * - plug(): Client-side Registry injection (Safe for Browser)
 */

import { Registry } from '../../core/registry.js';
import { prisma } from '../../db/prisma.js';
import { SchemaSyncService } from '../../services/SchemaSyncService.js';
import { FactoryLogic } from './FactoryLogic.js';
// [IMPORTANT]: Do NOT import FactoryWidget here if it contains JSX, unless you use dynamic import inside plug()
import { FactorySidebar } from './FactorySidebar.js';
import { FactoryMapping } from './FactoryMapping.js';
import { FactorySchema, factorySchema } from './FactorySchema.js';

export const FactoryDomain = {
  getSensors() {
    return [
      { sensorType: 'Machine Temp', unit: 'C', dataType: 'INTEGER', alertTemplate: 'High Temperature detected in ${device}! Current value: ${value}C' },
      { sensorType: 'Vibration History', unit: 'Hz', dataType: 'FLOAT', alertTemplate: 'Excessive Vibration on ${device}! Measured: ${value}Hz' },
      { sensorType: 'Pressure', unit: 'Psi', dataType: 'INTEGER', alertTemplate: 'Pressure Breach in ${device}! System pressure: ${value}Psi' }
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
          create: { ...s, id: s.sensorType }
        });
      }
      console.log('[SPLA-FACTORY] Database synchronized successfully.');
    } catch (dbError) {
      console.error('[SPLA-FACTORY] DB sync failed:', dbError.message);
    }
  },

  /**
   * CLIENT-SIDE: Core Registry injection (Safe for Browser/JSX)
   */
  async plug() {
    // Dynamic import to avoid Node.js JSX parsing error during early boot
    const { FactoryWidget } = await import('./FactoryWidget.jsx');
    
    Registry.plug(
      FactoryLogic,
      FactoryWidget,
      FactorySidebar,
      FactoryMapping,
      FactorySchema
    );
    console.log('[SPLA-FACTORY] Components plugged into Core Registry.');
  }
};

export default FactoryDomain;
