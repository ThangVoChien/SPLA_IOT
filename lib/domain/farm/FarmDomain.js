/**
 * Domain Orchestrator Standard Interface:
 * - play(): Server-side DB synchronization (Safe for Node.js)
 * - plug(): Client-side Registry injection (Safe for Browser)
 */

import { Registry } from '../../core/registry.js';
import { prisma } from '../../db/prisma.js';
import { FarmLogic } from './FarmLogic.js';
import { FarmSidebar } from './FarmSidebar.js';
import { FarmMapping } from './FarmMapping.js';
import { FarmSchema } from './FarmSchema.js';

export const FarmDomain = {
	getSensors() {
		return [
			{
				sensorType: 'Soil Moisture',
				unit: '%',
				dataType: 'INTEGER',
				alertTemplate: 'Low soil moisture detected in ${device}! Current: ${value}%'
			},
			{
				sensorType: 'Temperature',
				unit: '°C',
				dataType: 'FLOAT',
				alertTemplate: 'Temperature alert in ${device}! Current: ${value}°C'
			},
			{
				sensorType: 'pH Level',
				unit: 'pH',
				dataType: 'FLOAT',
				alertTemplate: 'Soil pH out of range in ${device}! Current: ${value}pH'
			}
		];
	},

	/**
	 * SERVER-SIDE: Database synchronization (Safe for Node.js/Prisma)
	 */
	async play() {
		const sensors = this.getSensors();
		try {
			for (const sensor of sensors) {
				await prisma.sensor.upsert({
					where: { sensorType: sensor.sensorType },
					update: { ...sensor },
					create: {
						id: `sensor_${sensor.sensorType.toLowerCase().replace(/\s+/g, '_')}`,
						...sensor
					}
				});
			}
			console.log('[SPLA-FARM] Database synchronized successfully.');
		} catch (dbError) {
			console.error('[SPLA-FARM] DB sync failed:', dbError.message);
		}
	},

	/**
	 * CLIENT-SIDE: Core Registry injection (Safe for Browser/JSX)
	 */
	async plug() {
		const { FarmWidget } = await import('./FarmWidget.jsx');

		Registry.plug(
			FarmLogic,
			FarmWidget,
			FarmSidebar,
			FarmMapping,
			FarmSchema
		);

		console.log('[SPLA-FARM] Components plugged into Core Registry.');
	}
};

export default FarmDomain;
